<?php

namespace Modules\TaskManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDependency extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'depends_on_task_id',
        'dependency_type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The task that has the dependency
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    /**
     * The task that is depended upon
     */
    public function dependsOnTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'depends_on_task_id');
    }

    /**
     * Check if adding this dependency would create a circular reference
     */
    public static function wouldCreateCircularDependency(int $taskId, int $dependsOnTaskId): bool
    {
        // If the dependency task depends on the current task (directly or indirectly),
        // adding this dependency would create a circle
        return self::hasDependencyPath($dependsOnTaskId, $taskId);
    }

    /**
     * Check if there's a dependency path from sourceTaskId to targetTaskId
     */
    private static function hasDependencyPath(int $sourceTaskId, int $targetTaskId, array $visited = []): bool
    {
        // Prevent infinite loops
        if (in_array($sourceTaskId, $visited)) {
            return false;
        }

        // Direct dependency check
        if ($sourceTaskId === $targetTaskId) {
            return true;
        }

        $visited[] = $sourceTaskId;

        // Get all tasks that sourceTaskId depends on
        $dependencies = self::where('task_id', $sourceTaskId)->pluck('depends_on_task_id');

        foreach ($dependencies as $dependencyId) {
            if (self::hasDependencyPath($dependencyId, $targetTaskId, $visited)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the full dependency chain for a task
     */
    public static function getDependencyChain(int $taskId): array
    {
        $chain = [];
        $visited = [];
        
        self::buildDependencyChain($taskId, $chain, $visited);
        
        return $chain;
    }

    /**
     * Recursively build dependency chain
     */
    private static function buildDependencyChain(int $taskId, array &$chain, array &$visited): void
    {
        if (in_array($taskId, $visited)) {
            return;
        }

        $visited[] = $taskId;
        
        $dependencies = self::where('task_id', $taskId)
            ->with('dependsOnTask')
            ->get();

        foreach ($dependencies as $dependency) {
            $chain[] = [
                'task_id' => $dependency->task_id,
                'depends_on_task_id' => $dependency->depends_on_task_id,
                'dependency_type' => $dependency->dependency_type,
                'depends_on_task' => $dependency->dependsOnTask,
            ];

            self::buildDependencyChain($dependency->depends_on_task_id, $chain, $visited);
        }
    }
}
