<?php

namespace Modules\TaskManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'task_status_id' => ['required', 'exists:task_statuses,id'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'deadline' => ['nullable', 'date', 'after_or_equal:today'],
            'assigned_users' => ['nullable', 'array'],
            'assigned_users.*' => ['exists:users,id'],
            'project_id' => ['required', 'exists:projects,id'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Ensure task_status_id belongs to the same project
            $projectId = $this->route('project')?->id ?? $this->input('project_id');
            $taskStatusId = $this->input('task_status_id');

            if ($projectId && $taskStatusId) {
                $statusBelongsToProject = \Modules\TaskManagement\Models\TaskStatus::where('id', $taskStatusId)
                    ->where('project_id', $projectId)
                    ->exists();

                if (!$statusBelongsToProject) {
                    $validator->errors()->add(
                        'task_status_id',
                        'The selected status does not belong to this project.'
                    );
                }
            }
        });
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'task_status_id' => 'status',
            'assigned_users' => 'assigned users',
            'assigned_users.*' => 'assigned user',
        ];
    }
}
