<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Modules\TaskManagement\Http\Requests\TaskStatusRequest;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of task statuses.
     */
    public function index()
    {
        $statuses = TaskStatus::sorted()->withCount('tasks')->get();

        return response()->json([
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created task status.
     */
    public function store(TaskStatusRequest $request)
    {
        $data = $request->validated();

        // Auto-generate sort number if not provided
        if (!isset($data['sort'])) {
            $data['sort'] = TaskStatus::max('sort') + 1;
        }

        // Ensure only one default status
        if ($data['is_default'] ?? false) {
            TaskStatus::where('is_default', true)->update(['is_default' => false]);
        }

        $status = TaskStatus::create($data);

        return response()->json([
            'success' => true,
            'status' => $status,
            'message' => 'Status created successfully.',
        ]);
    }

    /**
     * Update the specified task status.
     */
    public function update(TaskStatusRequest $request, TaskStatus $taskStatus)
    {
        $data = $request->validated();

        // Ensure only one default status
        if (($data['is_default'] ?? false) && !$taskStatus->is_default) {
            TaskStatus::where('is_default', true)->update(['is_default' => false]);
        }

        $taskStatus->update($data);

        return response()->json([
            'success' => true,
            'status' => $taskStatus->fresh(),
            'message' => 'Status updated successfully.',
        ]);
    }

    /**
     * Remove the specified task status.
     */
    public function destroy(TaskStatus $taskStatus)
    {
        // Prevent deletion if status has tasks
        if ($taskStatus->tasks()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete status with existing tasks.',
            ], 422);
        }

        // Prevent deletion of default status
        if ($taskStatus->is_default) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete the default status.',
            ], 422);
        }

        $taskStatus->delete();

        return response()->json([
            'success' => true,
            'message' => 'Status deleted successfully.',
        ]);
    }

    /**
     * Reorder task statuses.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'statuses' => 'required|array',
            'statuses.*.id' => 'required|exists:task_statuses,id',
            'statuses.*.sort' => 'required|integer|min:0',
        ]);

        foreach ($validated['statuses'] as $statusData) {
            TaskStatus::where('id', $statusData['id'])
                ->update(['sort' => $statusData['sort']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Statuses reordered successfully.',
        ]);
    }
}
