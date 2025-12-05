<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\TaskManagement\Http\Requests\TaskStatusRequest;
use Modules\TaskManagement\Models\Project;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of task statuses.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', TaskStatus::class);
        
        // Get available projects for dropdown
        $projects = Project::active()->get();
        
        // Get selected project from query param or default to first project
        $selectedProjectId = $request->input('project_id', $projects->first()?->id);
        
        // If no projects exist, show empty state
        if (!$selectedProjectId) {
            return Inertia::render('TaskManagement::statuses/index', [
                'statuses' => ['data' => []],
                'projects' => [],
                'selectedProject' => null,
            ]);
        }

        $statuses = TaskStatus::forProject($selectedProjectId)
            ->sorted()
            ->withCount([
                'tasks' => function ($query) use ($selectedProjectId) {
                    $query->where('project_id', $selectedProjectId);
                }
            ])
            ->paginate(15);

        return Inertia::render('TaskManagement::statuses/index', [
            'statuses' => $statuses,
            'projects' => $projects,
            'selectedProject' => $selectedProjectId,
        ]);
    }

    /**
     * Show the form for creating a new task status.
     */
    public function create(Request $request)
    {
        $this->authorize('create', TaskStatus::class);
        
        // Get selected project from query param
        $projects = Project::active()->get();
        $selectedProjectId = $request->input('project_id', $projects->first()?->id);
        
        // Calculate next sort for the selected project
        $nextSort = $selectedProjectId 
            ? TaskStatus::forProject($selectedProjectId)->max('sort') + 1
            : 0;

        return Inertia::render('TaskManagement::statuses/create', [
            'nextSort' => $nextSort,
            'projects' => $projects,
            'selectedProject' => $selectedProjectId,
        ]);
    }

    /**
     * Store a newly created task status.
     */
    public function store(TaskStatusRequest $request)
    {
        $this->authorize('create', TaskStatus::class);

        $data = $request->validated();

        // Auto-generate sort number if not provided (scoped to project)
        if (!isset($data['sort']) && isset($data['project_id'])) {
            $data['sort'] = TaskStatus::forProject($data['project_id'])->max('sort') + 1;
        }

        // Ensure only one default status per project
        if ($data['is_default'] ?? false) {
            TaskStatus::forProject($data['project_id'])
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        TaskStatus::create($data);

        // Preserve project_id when redirecting
        $queryParams = ['project_id' => $data['project_id']];
        
        // Check for explicit return parameter (e.g., from Kanban ?return=kanban)
        $returnRoute = match($request->query('return')) {
            'kanban' => 'task-management.kanban-board.index',
            default => 'task-management.task-statuses.index',
        };

        return redirect()->route($returnRoute, $queryParams)
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
