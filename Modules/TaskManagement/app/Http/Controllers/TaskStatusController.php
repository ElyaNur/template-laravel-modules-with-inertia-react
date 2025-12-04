<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\TaskManagement\Http\Requests\TaskStatusRequest;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of task statuses.
     */
    public function index()
    {
        $this->authorize('viewAny', TaskStatus::class);

        $statuses = TaskStatus::sorted()->withCount('tasks')->paginate(15);

        return Inertia::render('TaskManagement::statuses/index', [
            'statuses' => $statuses,
        ]);
    }

    /**
     * Show the form for creating a new task status.
     */
    public function create()
    {
        $this->authorize('create', TaskStatus::class);

        return Inertia::render('TaskManagement::statuses/create', [
            'nextSort' => TaskStatus::max('sort') + 1,
        ]);
    }

    /**
     * Store a newly created task status.
     */
    public function store(TaskStatusRequest $request)
    {
        $this->authorize('create', TaskStatus::class);

        $data = $request->validated();

        // Auto-generate sort number if not provided
        if (!isset($data['sort'])) {
            $data['sort'] = TaskStatus::max('sort') + 1;
        }

        // Ensure only one default status
        if ($data['is_default'] ?? false) {
            TaskStatus::where('is_default', true)->update(['is_default' => false]);
        }

        TaskStatus::create($data);

        // Check for explicit return parameter (e.g., from Kanban ?return=kanban)
        $returnRoute = match($request->query('return')) {
            'kanban' => 'task-management.kanban-board.index',
            default => 'task-management.task-statuses.index',
        };

        return redirect()->route($returnRoute)
            ->with('toast', [
                'success' => true,
                'message' => 'Status created successfully.',
            ]);
    }

    /**
     * Show the form for editing the specified task status.
     */
    public function edit(TaskStatus $taskStatus)
    {
        $this->authorize('update', $taskStatus);

        return Inertia::render('TaskManagement::statuses/edit', [
            'status' => $taskStatus,
        ]);
    }

    /**
     * Update the specified task status.
     */
    public function update(TaskStatusRequest $request, TaskStatus $taskStatus)
    {
        $this->authorize('update', $taskStatus);

        $data = $request->validated();

        // Ensure only one default status
        if (($data['is_default'] ?? false) && !$taskStatus->is_default) {
            TaskStatus::where('is_default', true)->update(['is_default' => false]);
        }

        $taskStatus->update($data);

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Status updated successfully.',
            ]);
    }

    /**
     * Remove the specified task status.
     */
    public function destroy(TaskStatus $taskStatus)
    {
        $this->authorize('delete', $taskStatus);

        // Prevent deletion if status has tasks
        if ($taskStatus->tasks()->count() > 0) {
            return redirect()->back()
                ->with('toast', [
                    'error' => true,
                    'message' => 'Cannot delete status with existing tasks. Please reassign tasks first.',
                ]);
        }

        // Prevent deletion of default status
        if ($taskStatus->is_default) {
            return redirect()->back()
                ->with('toast', [
                    'error' => true,
                    'message' => 'Cannot delete the default status. Please set another status as default first.',
                ]);
        }

        $taskStatus->delete();

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Status deleted successfully.',
            ]);
    }

    /**
     * Reorder task statuses.
     */
    public function reorder(Request $request)
    {
        $this->authorize('update', TaskStatus::class);

        $validated = $request->validate([
            'statuses' => 'required|array',
            'statuses.*.id' => 'required|exists:task_statuses,id',
            'statuses.*.sort' => 'required|integer|min:0',
        ]);

        foreach ($validated['statuses'] as $statusData) {
            TaskStatus::where('id', $statusData['id'])
                ->update(['sort' => $statusData['sort']]);
        }

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Statuses reordered successfully.',
            ]);
    }
}
