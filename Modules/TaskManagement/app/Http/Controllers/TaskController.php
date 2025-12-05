<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\TaskManagement\Http\Requests\TaskRequest;
use Modules\TaskManagement\Models\Project;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskStatus;
use Modules\TaskManagement\Services\TaskService;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly TaskService $taskService
    ) {}

    /**
     * Display a listing of tasks.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Task::class);
        
        // Get available projects for dropdown
        $projects = Project::active()->get();
        
        // Get selected project from query param or default to first project
        $selectedProjectId = $request->input('project_id', $projects->first()?->id);
        
        // If no projects exist, show empty state
        if (!$selectedProjectId) {
            return Inertia::render('TaskManagement::tasks/index', [
                'tasks' => ['data' => [], 'total' => 0],
                'statuses' => [],
                'users' => User::select('id', 'name', 'email')->get(),
                'projects' => [],
                'selectedProject' => null,
                'filters' => [],
            ]);
        }

        $filters = $request->only(['status', 'priority', 'assigned_to', 'filter', 'overdue', 'sort', 'withTrashed']);
        $tasks = $this->taskService->getTasksForDataTable($filters, $selectedProjectId);

        return Inertia::render('TaskManagement::tasks/index', [
            'tasks' => $tasks,
            'statuses' => TaskStatus::forProject($selectedProjectId)->sorted()->get(),
            'users' => User::select('id', 'name', 'email')->get(),
            'projects' => $projects,
            'selectedProject' => $selectedProjectId,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the kanban board.
     */
    public function kanban(Request $request)
    {
        $this->authorize('viewAny', Task::class);
        
        // Get available projects for dropdown
        $projects = Project::active()->get();
        
        // Get selected project from query param or default to first project
        $selectedProjectId = $request->input('project_id', $projects->first()?->id);
        
        // If no projects exist, show empty state
        if (!$selectedProjectId) {
            return Inertia::render('TaskManagement::tasks/kanban', [
                'kanbanData' => [],
                'users' => User::select('id', 'name', 'email')->get(),
                'projects' => [],
                'selectedProject' => null,
                'filters' => [],
            ]);
        }

        $filters = [
            'assigned_to' => $request->input('assigned_to'),
            'priority' => $request->input('priority'),
        ];

        $kanbanData = $this->taskService->getTasksForKanban(
            $filters['assigned_to'],
            $filters['priority'],
            $selectedProjectId
        );

        return Inertia::render('TaskManagement::tasks/kanban', [
            'kanbanData' => $kanbanData,
            'users' => User::select('id', 'name', 'email')->get(),
            'projects' => $projects,
            'selectedProject' => $selectedProjectId,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Task::class);
        
        // Get selected project from query param
        $projects = Project::active()->get();
        $selectedProjectId = $request->input('project_id', $projects->first()?->id);

        return Inertia::render('TaskManagement::tasks/create', [
            'statuses' => $selectedProjectId ? TaskStatus::forProject($selectedProjectId)->sorted()->get() : [],
            'users' => User::select('id', 'name', 'email')->get(),
            'projects' => $projects,
            'selectedProject' => $selectedProjectId,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(TaskRequest $request)
    {
        $this->authorize('create', Task::class);

        $data = $request->validated();
        $data['created_by'] = auth()->id();

        // Get next sort number for the status
        $data['sort'] = $this->taskService->getNextSortForStatus($data['task_status_id']);

        $task = $this->taskService->createTask($data);

        // Check for explicit return parameter (e.g., from Kanban ?return=kanban)
        $returnRoute = match($request->query('return')) {
            'kanban' => 'task-management.kanban-board.index',
            default => 'task-management.all-tasks.index',
        };

        return redirect()->route($returnRoute)
            ->with('toast', [
                'success' => true,
                'message' => 'Task created successfully.',
            ]);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load(['status', 'creator', 'assignedUsers']);

        return Inertia::render('TaskManagement::tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Task $task)
    {
        $this->authorize('update', $task);

        $task->load(['status', 'creator', 'assignedUsers']);

        return Inertia::render('TaskManagement::tasks/edit', [
            'task' => $task,
            'statuses' => TaskStatus::forProject($task->project_id)->sorted()->get(),
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(TaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $data = $request->validated();
        $this->taskService->updateTask($task, $data);

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Task updated successfully.',
            ]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->taskService->deleteTask($task);

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Task deleted successfully.',
            ]);
    }

    /**
     * Update task status (for drag and drop in kanban).
     */
    public function updateStatus(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'task_status_id' => 'required|exists:task_statuses,id',
            'sort' => 'required|integer|min:0',
        ]);

        $updatedTask = $this->taskService->updateTaskStatus(
            $task,
            $validated['task_status_id'],
            $validated['sort']
        );

        return redirect()->back()->with('toast', [
            'success' => true,
            'message' => 'Task status updated successfully.',
        ]);
    }

    /**
     * Mark task as completed.
     */
    public function markAsCompleted(Task $task)
    {
        $this->authorize('update', $task);

        $this->taskService->markAsCompleted($task);

        return redirect()->back()
            ->with('toast', [
                'success' => true,
                'message' => 'Task marked as completed.',
            ]);
    }
}
