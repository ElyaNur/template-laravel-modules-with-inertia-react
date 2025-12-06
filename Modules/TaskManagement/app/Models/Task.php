<?php

namespace Modules\TaskManagement\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Task extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'description',
        'task_status_id',
        'priority',
        'created_by',
        'deadline',
        'completed_at',
        'sort',
        'project_id',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'completed_at' => 'datetime',
        'sort' => 'integer',
    ];

    /**
     * Get the project this task belongs to.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the status for this task.
     */
    public function status()
    {
        return $this->belongsTo(TaskStatus::class, 'task_status_id');
    }

    /**
     * Get the user who created this task.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the users assigned to this task.
     */
    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withTimestamps();
    }

    /**
     * Get the comments for this task (top-level only).
     */
    public function comments()
    {
        return $this->hasMany(TaskComment::class)->whereNull('parent_id')->latest();
    }

    /**
     * Get all comments for this task (including replies).
     */
    public function allComments()
    {
        return $this->hasMany(TaskComment::class)->latest();
    }

    /**
     * Get the attachments for this task.
     */
    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }

    /**
     * Get the dependencies for this task (tasks this task depends on).
     */
    public function dependencies()
    {
        return $this->hasMany(TaskDependency::class, 'task_id');
    }

    /**
     * Get the dependent tasks (tasks that depend on this task).
     */
    public function dependentTasks()
    {
        return $this->hasMany(TaskDependency::class, 'depends_on_task_id');
    }

    /**
     * Scope to filter by priority.
     */
    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus($query, $statusId)
    {
        return $query->where('task_status_id', $statusId);
    }

    /**
     * Scope to filter by assigned user.
     */
    public function scopeAssignedTo($query, $userId)
    {
        return $query->whereHas('assignedUsers', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    /**
     * Scope for overdue tasks.
     */
    public function scopeOverdue($query)
    {
        return $query->where('deadline', '<', now())
            ->whereNull('completed_at');
    }

    /**
     * Scope to order by sort within status.
     */
    public function scopeSorted($query)
    {
        return $query->orderBy('sort');
    }

    /**
     * Scope to filter by project.
     */
    public function scopeForProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    /**
     * Check if the task is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->deadline && $this->deadline->isPast() && !$this->completed_at;
    }

    /**
     * Check if the task is completed.
     */
    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }

    /**
     * Check if the task is blocked by incomplete dependencies.
     */
    public function isBlocked(): bool
    {
        // A task is blocked if it has dependencies where the dependent task is not completed
        return $this->dependencies()
            ->whereHas('dependsOnTask', function($query) {
                $query->whereNull('completed_at');
            })
            ->exists();
    }

    /**
     * Get all blocking tasks (incomplete tasks this task depends on).
     */
    public function getBlockingTasks()
    {
        return $this->dependencies()
            ->with('dependsOnTask')
            ->whereHas('dependsOnTask', function($query) {
                $query->whereNull('completed_at');
            })
            ->get()
            ->pluck('dependsOnTask');
    }

    /**
     * Mark task as completed.
     */
    public function markAsCompleted(): void
    {
        $this->completed_at = now();
        $this->save();
    }

    /**
     * Get priority badge color.
     */
    public function getPriorityColorAttribute(): string
    {
        return match ($this->priority) {
            'low' => '#94a3b8',      // gray
            'medium' => '#3b82f6',   // blue
            'high' => '#f59e0b',     // orange
            'urgent' => '#ef4444',   // red
            default => '#94a3b8',
        };
    }

    /**
     * Activity log configuration.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'description', 'task_status_id', 'priority', 'deadline', 'completed_at', 'project_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
