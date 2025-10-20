<?php

namespace App\Contracts\Services;

use Illuminate\Database\Eloquent\Model;


interface ServiceInterface
{
    public function save(array $validated): array;

    public function update(Model $model, array $validated): array;

    public function delete(Model $model): array;
}
