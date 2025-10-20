<?php

namespace Modules\Settings\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Settings\Role;

class RoleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'guard_name' => ['nullable'],
            'team_id' => ['nullable', 'integer'],
            'name' => ['required'],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ];
    }

    public function authorize(): bool
    {
        if ($this->route('role')) {
            return $this->user()->can('update', $this->route('role'));
        }

        return $this->user()->can('create', Role::class);
    }
}
