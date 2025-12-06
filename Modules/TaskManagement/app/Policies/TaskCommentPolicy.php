<?php

namespace Modules\TaskManagement\Policies;

use App\Models\User;
use Modules\TaskManagement\Models\TaskComment;

class TaskCommentPolicy
{
    /**
     * Determine if the user can update the comment.
     */
    public function update(User $user, TaskComment $comment): bool
    {
        return $user->id === $comment->user_id;
    }

    /**
     * Determine if the user can delete the comment.
     */
    public function delete(User $user, TaskComment $comment): bool
    {
        // User can delete their own comment or super admin can delete any
        return $user->id === $comment->user_id || $user->hasRole('super admin');
    }
}
