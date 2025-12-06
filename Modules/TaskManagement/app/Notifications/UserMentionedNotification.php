<?php

namespace Modules\TaskManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\TaskManagement\Models\TaskComment;

class UserMentionedNotification extends Notification implements ShouldQueue
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
            ->subject('You were mentioned in a comment')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($this->comment->user->name . ' mentioned you in a comment.')
            ->line('**Task:** ' . $this->comment->task->title)
            ->line('**Comment:** ' . substr($this->comment->content, 0, 100) . (strlen($this->comment->content) > 100 ? '...' : ''))
            ->action('View Comment', url("/task-management/all-tasks/{$this->comment->task_id}"))
            ->line('Thank you!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->comment->task_id,
            'task_title' => $this->comment->task->title,
            'comment_id' => $this->comment->id,
            'mentioned_by' => $this->comment->user->name,
            'action_url' => "/task-management/all-tasks/{$this->comment->task_id}",
            'message' => "{$this->comment->user->name} mentioned you in a comment on: {$this->comment->task->title}",
        ];
    }
}
