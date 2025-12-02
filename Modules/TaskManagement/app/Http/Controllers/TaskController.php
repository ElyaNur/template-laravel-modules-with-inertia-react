<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\TaskManagement\Http\Requests\TaskRequest;
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

        $filters = $request->only(['status', 'priority', 'assigned_to', 'search', 'overdue']);
        $tasks = $this->taskService->getTasksForDataTable($filters);

        return Inertia::render('TaskManagement::index', [
            'tasks' => $tasks,
            'statuses' => TaskStatus::sorted()->get(),
            'users' => User::select('id', 'name', 'email')->get(),
            'filters' => $filters,
        ]);
    }

    /**
     * Display the kanban board.
     */
    public function kanban(Request $request)
    {
        $this->authorize('viewAny', Task::class);

        $filters = [
            'assigned_to' => $request->input('assigned_to'),
            'priority' => $request->input('priority'),
        ];

        $kanbanData = $this->taskService->getTasksForKanban(
            $filters['assigned_to'],
            $filters['priority']
        );

        return Inertia::render('TaskManagement::kanban', [
            'kanbanData' => $kanbanData,
            'users' => User::select('id', 'name', 'email')->get(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create()
    {
        $this->authorize('create', Task::class);

        return Inertia::render('TaskManagement::create', [
            'statuses' => TaskStatus::sorted()->get(),
            'users' => User::select('id', 'name', 'email')->get(),
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

        return redirect()->route('tasks.index')
            ->with('toast', [
                'type' => 'success',
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

        return Inertia::render('TaskManagement::show', [
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

        return Inertia::render('TaskManagement::edit', [
            'task' => $task,
            'statuses' => TaskStatus::sorted()->get(),
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

        return redirect()->route('tasks.index')
            ->with('toast', [
                'type' => 'success',
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
                'type' => 'success',
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

        return response()->json([
            'success' => true,
            'task' => $updatedTask,
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
                'type' => 'success',
                'message' => 'Task marked as completed.',
            ]);
    }
}
