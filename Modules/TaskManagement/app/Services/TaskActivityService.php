<?php

namespace Modules\TaskManagement\Services;

use Spatie\Activitylog\Models\Activity;

class TaskActivityService
{
    /**
     * Format activity for frontend display.
     */
    public static function formatActivity(Activity $activity): array
    {
        return [
            'id' => $activity->id,
            'description' => self::getDescription($activity),
            'icon' => self::getIcon($activity),
            'color' => self::getColor($activity),
            'causer' => $activity->causer?->name ?? 'System',
            'created_at' => $activity->created_at->toISOString(),
        ];
    }

    /**
     * Get human-readable description.
     */
    private static function getDescription(Activity $activity): string
    {
        $properties = $activity->properties;
        
        return match($activity->description) {
            'status_changed' => self::formatStatusChange($properties),
            'marked_complete' => 'marked this task as complete',
            'marked_incomplete' => 'reopened this task',
            'user_assigned' => self::formatAssignment($properties),
            'user_unassigned' => self::formatUnassignment($properties),
            'comment_added' => $properties['is_reply'] ?? false ? 'replied to a comment' : 'commented',
            'comment_deleted' => 'deleted a comment',
            'attachment_uploaded' => self::formatAttachmentUpload($properties),
            'attachment_deleted' => self::formatAttachmentDelete($properties),
            'created' => 'created this task',
            'updated' => self::formatUpdate($activity),
            'deleted' => 'deleted this task',
            default => $activity->description,
        };
    }

    /**
     * Format status change description.
     */
    private static function formatStatusChange($properties): string
    {
        $old = $properties['old_status'] ?? 'unknown';
        $new = $properties['new_status'] ?? 'unknown';
        return "moved from '{$old}' → '{$new}'";
    }

    /**
     * Format user assignment.
     */
    private static function formatAssignment($properties): string
    {
        $userName = $properties['user_name'] ?? 'someone';
        return "assigned this to {$userName}";
    }

    /**
     * Format user unassignment.
     */
    private static function formatUnassignment($properties): string
    {
        $userName = $properties['user_name'] ?? 'someone';
        return "removed {$userName} from this task";
    }

    /**
     * Format attachment upload.
     */
    private static function formatAttachmentUpload($properties): string
    {
        $filename = $properties['filename'] ?? 'a file';
        return "uploaded {$filename}";
    }

    /**
     * Format attachment deletion.
     */
    private static function formatAttachmentDelete($properties): string
    {
        $filename = $properties['filename'] ?? 'a file';
        return "removed {$filename}";
    }

    /**
     * Format general update.
     */
    private static function formatUpdate(Activity $activity): string
    {
        $changes = [];
        $attributes = $activity->properties['attributes'] ?? [];
        $old = $activity->properties['old'] ?? [];

        if (isset($attributes['title'])) {
            $changes[] = 'title';
        }
        if (isset($attributes['description'])) {
            $changes[] = 'description';
        }
        if (isset($attributes['priority'])) {
            $oldPriority = ucfirst($old['priority'] ?? '');
            $newPriority = ucfirst($attributes['priority']);
            return "changed priority from {$oldPriority} to {$newPriority}";
        }
        if (isset($attributes['deadline'])) {
            $newDeadline = date('M d, Y', strtotime($attributes['deadline']));
            return "set deadline to {$newDeadline}";
        }

        return $changes ? 'updated ' . implode(' and ', $changes) : 'updated this task';
    }

    /**
     * Get icon name for activity type.
     */
    private static function getIcon(Activity $activity): string
    {
        return match($activity->description) {
            'created' => 'plus-circle',
            'status_changed' => 'arrow-right',
            'marked_complete' => 'check-circle',
            'marked_incomplete' => 'circle',
            'user_assigned' => 'user-plus',
            'user_unassigned' => 'user-minus',
            'comment_added' => 'message-square',
            'comment_deleted' => 'message-square',
            'attachment_uploaded' => 'paperclip',
            'attachment_deleted' => 'paperclip',
            'updated' => 'edit',
            'deleted' => 'trash',
            default => 'activity',
        };
    }

    /**
     * Get color class for activity type.
     */
    private static function getColor(Activity $activity): string
    {
        return match($activity->description) {
            'created' => 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            'status_changed' => 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            'marked_complete' => 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            'marked_incomplete' => 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
            'user_assigned' => 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            'user_unassigned' => 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
            'comment_added' => 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
            'comment_deleted' => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
            'attachment_uploaded' => 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
            'attachment_deleted' => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
            'updated' => 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
            'deleted' => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
            default => 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
        };
    }
}
