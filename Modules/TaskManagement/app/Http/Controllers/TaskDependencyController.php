<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\TaskManagement\Http\Requests\StoreTaskDependencyRequest;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskDependency;
use Illuminate\Http\Request;

class TaskDependencyController extends Controller
{
    /**
     * Display dependencies for a specific task.
     */
    public function index(Task $task)
    {
        $dependencies = $task->dependencies()->with('dependsOnTask')->get();
        $dependentTasks = $task->dependentTasks()->with('task')->get();
        
        return response()->json([
            'dependencies' => $dependencies,
            'dependent_tasks' => $dependentTasks,
            'is_blocked' => $task->isBlocked(),
            'blocking_tasks' => $task->getBlockingTasks(),
        ]);
    }

    /**
     * Store a newly created dependency.
     */
    public function store(StoreTaskDependencyRequest $request, Task $task)
    {
        $dependency = TaskDependency::create([
            'task_id' => $task->id,
            'depends_on_task_id' => $request->depends_on_task_id,
            'dependency_type' => $request->dependency_type ?? 'finish_to_start',
        ]);

        $dependency->load('dependsOnTask');

        return response()->json([
            'message' => 'Dependency added successfully.',
            'dependency' => $dependency,
            'is_blocked' => $task->isBlocked(),
        ], 201);
    }

    /**
     * Remove the specified dependency.
     */
    public function destroy(Task $task, TaskDependency $dependency)
    {
        // Verify the dependency belongs to this task
        if ($dependency->task_id !== $task->id) {
            return response()->json([
                'message' => 'Dependency not found for this task.',
            ], 404);
        }

        $dependency->delete();

        return response()->json([
            'message' => 'Dependency removed successfully.',
            'is_blocked' => $task->fresh()->isBlocked(),
        ]);
    }
}
