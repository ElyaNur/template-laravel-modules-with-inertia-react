<?php

namespace Modules\TaskManagement\Services;

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
    public function getTasksForDataTable(array $filters = []): Collection
    {
        $query = Task::with(['status', 'creator', 'assignedUsers']);

        if (isset($filters['status'])) {
            $query->status($filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->priority($filters['priority']);
        }

        if (isset($filters['assigned_to'])) {
            $query->assignedTo($filters['assigned_to']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['overdue']) && $filters['overdue']) {
            $query->overdue();
        }

        return $query->latest()->get();
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
        $task->update([
            'task_status_id' => $statusId,
            'sort' => $sort,
        ]);

        // Mark as completed if moving to completed status
        $status = TaskStatus::find($statusId);
        if ($status && $status->is_completed && !$task->completed_at) {
            $task->markAsCompleted();
        }

        return $task->fresh(['status', 'creator', 'assignedUsers']);
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
