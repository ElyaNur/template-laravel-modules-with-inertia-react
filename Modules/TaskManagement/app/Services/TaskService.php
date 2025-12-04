<?php

namespace Modules\TaskManagement\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskStatus;

class TaskService
{
    /**
     * Get tasks grouped by status for kanban board.
     */
    public function getTasksForKanban(?int $assignedUserId = null, ?string $priority = null): array
    {
        $statuses = TaskStatus::sorted()->with(['tasks' => function ($query) use ($assignedUserId, $priority) {
            $query->sorted()->with(['creator', 'assignedUsers']);
            
            if ($assignedUserId) {
                $query->assignedTo($assignedUserId);
            }
            
            if ($priority) {
                $query->priority($priority);
            }
        }])->get();

        return $statuses->map(function ($status) {
            return [
                'id' => $status->id,
                'name' => $status->name,
                'slug' => $status->slug,
                'color' => $status->color,
                'is_completed' => $status->is_completed,
                'tasks' => $status->tasks->map(fn($task) => $this->formatTaskForKanban($task)),
            ];
        })->toArray();
    }

    /**
     * Get tasks for data table with filtering.
     */
    public function getTasksForDataTable(array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['status', 'creator', 'assignedUsers']);

        // Handle soft deletes
        if (isset($filters['withTrashed'])) {
            if ($filters['withTrashed'] === 'only-trashed') {
                $query->onlyTrashed();
            } elseif ($filters['withTrashed'] === 'with-trashed') {
                $query->withTrashed();
            }
            // Default is without trashed
        }

        // Apply filters
        if (isset($filters['status'])) {
            $query->status($filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->priority($filters['priority']);
        }

        if (isset($filters['assigned_to'])) {
            $query->assignedTo($filters['assigned_to']);
        }

        if (isset($filters['filter']) && !empty($filters['filter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['filter'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['filter'] . '%');
            });
        }

        if (isset($filters['overdue']) && $filters['overdue']) {
            $query->overdue();
        }

        // Apply sorting
        if (isset($filters['sort']) && !empty($filters['sort'])) {
            // Column mapping for sortable fields
            $columnMap = [
                'status' => 'task_status_id',
                'created_by' => 'created_by',
                'title' => 'title',
                'priority' => 'priority',
                'deadline' => 'deadline',
                'created_at' => 'created_at',
                'updated_at' => 'updated_at',
            ];

            $sorts = explode(',', $filters['sort']);
            foreach ($sorts as $sort) {
                [$column, $direction] = explode(':', $sort);
                
                // Map frontend column to database column
                $dbColumn = $columnMap[$column] ?? $column;
                
                // Only allow whitelisted columns
                if (isset($columnMap[$column])) {
                    $query->orderBy($dbColumn, $direction);
                }
            }
        } else {
            $query->latest();
        }

        return $query->paginate(15);
    }

    /**
     * Create a new task.
     */
    public function createTask(array $data): Task
    {
        return DB::transaction(function () use ($data) {
            $assignedUsers = $data['assigned_users'] ?? [];
            unset($data['assigned_users']);

            $task = Task::create($data);

            if (!empty($assignedUsers)) {
                $task->assignedUsers()->attach($assignedUsers);
            }

            return $task->load(['status', 'creator', 'assignedUsers']);
        });
    }

    /**
     * Update an existing task.
     */
    public function updateTask(Task $task, array $data): Task
    {
        return DB::transaction(function () use ($task, $data) {
            $assignedUsers = $data['assigned_users'] ?? null;
            unset($data['assigned_users']);

            $task->update($data);

            if ($assignedUsers !== null) {
                $task->assignedUsers()->sync($assignedUsers);
            }

            return $task->fresh(['status', 'creator', 'assignedUsers']);
        });
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Assign users to a task.
     */
    public function assignUsers(Task $task, array $userIds): void
    {
        $task->assignedUsers()->sync($userIds);
    }

    /**
     * Update task status and sort order (for drag and drop).
     */
    public function updateTaskStatus(Task $task, int $statusId, int $sort): Task
    {
        $oldStatusId = $task->task_status_id;
        $oldSort = $task->sort;
        
        return DB::transaction(function () use ($task, $statusId, $sort, $oldStatusId, $oldSort) {
            // Moving to a different column
            if ($oldStatusId !== $statusId) {
                // 1. In SOURCE column: Shift down tasks that were after the removed task
                Task::where('task_status_id', $oldStatusId)
                    ->where('sort', '>', $oldSort)
                    ->decrement('sort');

                // 2. In TARGET column: Shift up tasks at and after the insertion position
                Task::where('task_status_id', $statusId)
                    ->where('sort', '>=', $sort)
                    ->increment('sort');

                // 3. Update the task with new status and position
                $task->update([
                    'task_status_id' => $statusId,
                    'sort' => $sort,
                ]);
            } else {
                // Reordering within the same column
                if ($sort > $oldSort) {
                    // Moving down: shift tasks between old and new position up
                    Task::where('task_status_id', $statusId)
                        ->where('sort', '>', $oldSort)
                        ->where('sort', '<=', $sort)
                        ->decrement('sort');
                } else if ($sort < $oldSort) {
                    // Moving up: shift tasks between new and old position down
                    Task::where('task_status_id', $statusId)
                        ->where('sort', '>=', $sort)
                        ->where('sort', '<', $oldSort)
                        ->increment('sort');
                }

                // Update the task position
                $task->update(['sort' => $sort]);
            }

            // Mark as completed if moving to completed status
            $status = TaskStatus::find($statusId);
            if ($status && $status->is_completed && !$task->completed_at) {
                $task->markAsCompleted();
            }

            return $task->fresh(['status', 'creator', 'assignedUsers']);
        });
    }

    /**
     * Mark task as completed.
     */
    public function markAsCompleted(Task $task): Task
    {
        $task->markAsCompleted();
        return $task->fresh();
    }

    /**
     * Get next sort number for a status.
     */
    public function getNextSortForStatus(int $statusId): int
    {
        return Task::where('task_status_id', $statusId)->max('sort') + 1;
    }

    /**
     * Format task data for kanban board.
     */
    protected function formatTaskForKanban(Task $task): array
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'priority' => $task->priority,
            'priority_color' => $task->priority_color,
            'deadline' => $task->deadline?->toISOString(),
            'is_overdue' => $task->isOverdue(),
            'assigned_users' => $task->assignedUsers->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]),
            'sort' => $task->sort,
        ];
    }

    /**
     * Get task statistics.
     */
    public function getTaskStatistics(): array
    {
        return [
            'total' => Task::count(),
            'completed' => Task::whereNotNull('completed_at')->count(),
            'overdue' => Task::overdue()->count(),
            'by_priority' => Task::select('priority', DB::raw('count(*) as count'))
                ->groupBy('priority')
                ->pluck('count', 'priority')
                ->toArray(),
            'by_status' => Task::select('task_status_id', DB::raw('count(*) as count'))
                ->groupBy('task_status_id')
                ->with('status:id,name')
                ->get()
                ->mapWithKeys(fn($item) => [$item->status->name => $item->count])
                ->toArray(),
        ];
    }
}
