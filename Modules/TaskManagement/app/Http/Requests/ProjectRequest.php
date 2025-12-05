<?php

namespace Modules\TaskManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $projectId = $this->route('project')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('projects', 'slug')->ignore($projectId),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'],
            'is_archived' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'project name',
            'slug' => 'project slug',
            'description' => 'project description',
            'color' => 'project color',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'color.regex' => 'The :attribute must be a valid hex color code (e.g., #3b82f6).',
            'slug.alpha_dash' => 'The :attribute may only contain letters, numbers, dashes, and underscores.',
        ];
    }
}
