<?php

namespace Modules\TaskManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskStatusRequest extends FormRequest
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
        $statusId = $this->route('taskStatus')?->id;

        $uniqueRule = 'unique:task_statuses,slug';
        if ($statusId) {
            $uniqueRule .= ',' . $statusId;
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', $uniqueRule],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'is_completed' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'color.regex' => 'The color must be a valid hex color code (e.g., #3b82f6).',
        ];
    }
}
