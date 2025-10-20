<?php

namespace Modules\Settings\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:254', 'unique:users,email'],
            'roles' => ['required', 'array'],
            'roles.*' => ['numeric', 'exists:roles,id'],
        ];
    }

    public function authorize(): bool
    {
        if ($this->route('user')) {
            return $this->user()->can('update', $this->route('user'));
        }

        return $this->user()->can('create', User::class);
    }
}
