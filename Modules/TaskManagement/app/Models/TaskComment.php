<?php

namespace Modules\TaskManagement\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class TaskComment extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'task_id',
        'user_id',
        'content',
        'parent_id',
    ];

    protected $with = ['user'];

    /**
     * Get the task this comment belongs to.
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Get the user who created this comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent comment (for threaded replies).
     */
    public function parent()
    {
        return $this->belongsTo(TaskComment::class, 'parent_id');
    }

    /**
     * Get all replies to this comment.
     */
    public function replies()
    {
        return $this->hasMany(TaskComment::class, 'parent_id')->with('replies');
    }

    /**
     * Extract mentioned users from content.
     * Looks for @username patterns and returns matching users.
     */
    public function getMentionedUsers(): Collection
    {
        preg_match_all('/@(\w+)/', $this->content, $matches);
        
        if (empty($matches[1])) {
            return collect();
        }
        
        return User::whereIn('username', $matches[1])->get();
    }

    /**
     * Scope to get only top-level comments (no parent).
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Activity log configuration.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['content', 'task_id', 'parent_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
