<?php

namespace Modules\Master\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Master\Agama;

class AgamaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:100'],
        ];
    }

    public function authorize(): bool
    {
        if ($this->route('agama')) {
            return $this->user()->can('update', $this->route('agama'));
        }

        return $this->user()->can('create', Agama::class);
    }
}
