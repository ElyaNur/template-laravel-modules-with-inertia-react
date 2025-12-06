<?php

namespace Modules\TaskManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\TaskManagement\Models\TaskDependency;
use Modules\TaskManagement\Models\Task;

class StoreTaskDependencyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if user has permission to edit the task
        $task = Task::findOrFail($this->route('task'));
        return true; // TODO: Add proper authorization policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'depends_on_task_id' => [
                'required',
                'integer',
                'exists:tasks,id',
                function ($attribute, $value, $fail) {
                    $taskId = $this->route('task');
                    
                    // Prevent self-dependency
                    if ($taskId == $value) {
                        $fail('A task cannot depend on itself.');
                        return;
                    }
                    
                    // Check for circular dependency
                    if (TaskDependency::wouldCreateCircularDependency($taskId, $value)) {
                        $fail('Adding this dependency would create a circular reference.');
                        return;
                    }
                    
                    // Check if dependency already exists
                    if (TaskDependency::where('task_id', $taskId)
                        ->where('depends_on_task_id', $value)
                        ->exists()) {
                        $fail('This dependency already exists.');
                    }
                },
            ],
            'dependency_type' => [
                'nullable',
                'string',
                'in:finish_to_start,start_to_start,finish_to_finish,start_to_finish',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'depends_on_task_id.required' => 'Please select a task to depend on.',
            'depends_on_task_id.exists' => 'The selected task does not exist.',
        ];
    }
}
