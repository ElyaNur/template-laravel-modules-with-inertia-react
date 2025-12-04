<?php

namespace Modules\TaskManagement\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any tasks.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('task:view-any');
    }

    /**
     * Determine if the user can view a specific task.
     */
    public function view(User $user): bool
    {
        return $user->can('task:view');
    }

    /**
     * Determine if the user can create tasks.
     */
    public function create(User $user): bool
    {
        return $user->can('task:create');
    }

    /**
     * Determine if the user can update a task.
     */
    public function update(User $user): bool
    {
        return $user->can('task:update');
    }

    /**
     * Determine if the user can delete a task.
     */
    public function delete(User $user): bool
    {
        return $user->can('task:delete');
    }

    /**
     * Determine if the user can restore a task.
     */
    public function restore(User $user): bool
    {
        return $user->can('task:restore');
    }

    /**
     * Determine if the user can permanently delete a task.
     */
    public function forceDelete(User $user): bool
    {
        return $user->can('task:force-delete');
    }

    /**
     * Determine if the user can assign users to tasks.
     */
    public function assign(User $user): bool
    {
        return $user->can('task:assign');
    }
}

