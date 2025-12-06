<?php

namespace Modules\TaskManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\TaskManagement\Models\TaskComment;

class TaskCommentedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public TaskComment $comment
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New comment on: ' . $this->comment->task->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($this->comment->user->name . ' commented on a task you\'re assigned to.')
            ->line('**Task:** ' . $this->comment->task->title)
            ->line('**Comment:** ' . substr($this->comment->content, 0, 100) . (strlen($this->comment->content) > 100 ? '...' : ''))
            ->action('View Task', url("/task-management/all-tasks/{$this->comment->task_id}"))
            ->line('Thank you!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->comment->task_id,
            'task_title' => $this->comment->task->title,
            'comment_id' => $this->comment->id,
            'commenter_name' => $this->comment->user->name,
            'action_url' => "/task-management/all-tasks/{$this->comment->task_id}",
            'message' => "{$this->comment->user->name} commented on: {$this->comment->task->title}",
        ];
    }
}
