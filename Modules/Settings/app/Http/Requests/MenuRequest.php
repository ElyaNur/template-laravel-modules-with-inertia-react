<?php

namespace Modules\Settings\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Settings\Menu;

class MenuRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'integer'],
            'nama' => ['required', 'string', 'max:20'],
            'is_active' => ['required', 'integer'],
            'aktif' => ['boolean'],
            'keterangan' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
            'permissions' => ['nullable', 'array'],
            'models' => ['nullable', 'array'],
            'sort' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        if ($this->route('menu')) {
            return $this->user()->can('update', $this->route('menu'));
        }

        return $this->user()->can('create', Menu::class);
    }
}
