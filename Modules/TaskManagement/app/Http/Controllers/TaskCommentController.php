<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Modules\TaskManagement\Http\Requests\TaskCommentRequest;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskComment;

class TaskCommentController extends Controller
{
    use AuthorizesRequests;
    /**
     * Store a new comment on a task.
     */
    public function store(TaskCommentRequest $request, Task $task)
    {
$comment = $task->allComments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'parent_id' => $request->parent_id,
        ]);

        // Log activity on the task
        activity('task')
            ->performedOn($task)
            ->withProperties([
                'comment_id' => $comment->id,
                'is_reply' => $comment->parent_id ? true : false,
            ])
            ->log('comment_added');

        // Notify mentioned users
        $mentionedUsers = $comment->getMentionedUsers();
        foreach ($mentionedUsers as $user) {
            if ($user->id !== auth()->id()) { // Don't notify yourself
                $user->notify(new \Modules\TaskManagement\Notifications\UserMentionedNotification($comment));
            }
        }

        // Notify task assignees (except comment author and already mentioned users)
        $task->assignedUsers()
            ->where('users.id', '!=', auth()->id()) // Qualify the column name to avoid ambiguity
            ->get()
            ->reject(fn($user) => $mentionedUsers->contains('id', $user->id)) // Don't double-notify
            ->each(fn($user) => $user->notify(new \Modules\TaskManagement\Notifications\TaskCommentedNotification($comment)));

        return back()->with('toast', [
            'success' => true,
            'message' => 'Comment added successfully'
        ]);
    }

    /**
     * Update an existing comment.
     */
    public function update(TaskCommentRequest $request, Task $task, TaskComment $comment)
    {
        $this->authorize('update', $comment);

        $comment->update([
            'content' => $request->content,
        ]);

        return back()->with('toast', [
            'success' => true,
            'message' => 'Comment updated successfully'
        ]);
    }

    /**
     * Delete a comment.
     */
    public function destroy(Task $task, TaskComment $comment)
    {
        $this->authorize('delete', $comment);

        // Log activity on the task before deleting
        activity('task')
            ->performedOn($comment->task)
            ->log('comment_deleted');

        $comment->delete();

        return back()->with('toast', [
            'success' => true,
            'message' => 'Comment deleted successfully'
        ]);
    }
}
