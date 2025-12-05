<?php

namespace Modules\TaskManagement\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class TaskStatus extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'sort',
        'is_default',
        'is_completed',
        'project_id',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_completed' => 'boolean',
        'sort' => 'integer',
    ];

    /**
     * Get the project this status belongs to.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the tasks for this status.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_status_id');
    }

    /**
     * Scope for active statuses only.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * Scope to order by sort column.
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
     * Check if this status marks tasks as completed.
     */
    public function isCompleted(): bool
    {
        return $this->is_completed;
    }

    /**
     * Check if this is the default status.
     */
    public function isDefault(): bool
    {
        return $this->is_default;
    }

    /**
     * Activity log configuration.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'slug', 'color', 'sort', 'is_default', 'is_completed', 'project_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
