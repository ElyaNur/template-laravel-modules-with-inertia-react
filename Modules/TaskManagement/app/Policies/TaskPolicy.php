<?php

namespace Modules\TaskManagement\Policies;

use App\Models\User;
use Modules\TaskManagement\Models\Task;

class TaskPolicy
{
    /**
     * Determine if the user can view any tasks.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view tasks
    }

    /**
     * Determine if the user can view a specific task.
     */
    public function view(User $user, Task $task): bool
    {
        return true; // All authenticated users can view tasks
    }

    /**
     * Determine if the user can create tasks.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can create tasks
    }

    /**
     * Determine if the user can update a task.
     */
    public function update(User $user, Task $task): bool
    {
        // Users can update tasks they created or are assigned to
        return $task->created_by === $user->id 
            || $task->assignedUsers->contains($user->id)
            || $user->hasRole('super admin');
    }

    /**
     * Determine if the user can delete a task.
     */
    public function delete(User $user, Task $task): bool
    {
        // Only creators and admins can delete tasks
        return $task->created_by === $user->id 
            || $user->hasRole('super admin');
    }

    /**
     * Determine if the user can assign users to tasks.
     */
    public function assign(User $user): bool
    {
        return true; //All authenticated users can assign
    }
}
