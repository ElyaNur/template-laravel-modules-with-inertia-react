<?php

namespace Modules\TaskManagement\Observers;

use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskStatus;

class TaskObserver
{
    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        // Track status changes
        if ($task->isDirty('task_status_id')) {
            $oldStatus = TaskStatus::find($task->getOriginal('task_status_id'));
            $newStatus = $task->status;
            
            activity('task')
                ->performedOn($task)
                ->withProperties([
                    'old_status' => $oldStatus?->name ?? 'Unknown',
                    'new_status' => $newStatus->name,
                ])
                ->log('status_changed');
        }

        // Track task completion
        if ($task->isDirty('completed_at')) {
            if ($task->completed_at) {
                activity('task')
                    ->performedOn($task)
                    ->log('marked_complete');
            } else {
                activity('task')
                    ->performedOn($task)
                    ->log('marked_incomplete');
            }
        }
    }
}
