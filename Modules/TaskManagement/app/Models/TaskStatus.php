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
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_completed' => 'boolean',
        'sort' => 'integer',
    ];

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
            ->logOnly(['name', 'slug', 'color', 'sort', 'is_default', 'is_completed'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
