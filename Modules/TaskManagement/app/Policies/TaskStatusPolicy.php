<?php

namespace Modules\TaskManagement\Policies;

use App\Models\User;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusPolicy
{
    /**
     * Determine whether the user can view any task statuses.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('task-status:view-any');
    }

    /**
     * Determine whether the user can view the task status.
     */
    public function view(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermissionTo('task-status:view');
    }

    /**
     * Determine whether the user can create task statuses.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('task-status:create');
    }

    /**
     * Determine whether the user can update the task status.
     */
    public function update(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermissionTo('task-status:update');
    }

    /**
     * Determine whether the user can delete the task status.
     */
    public function delete(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermissionTo('task-status:delete');
    }

    /**
     * Determine whether the user can restore the task status.
     */
    public function restore(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermissionTo('task-status:restore');
    }

    /**
     * Determine whether the user can permanently delete the task status.
     */
    public function forceDelete(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermissionTo('task-status:force-delete');
    }
}
