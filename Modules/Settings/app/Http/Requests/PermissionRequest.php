<?php

namespace Modules\Settings\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'guard_name' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
