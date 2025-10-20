<?php

namespace App\Services;

use App\Contracts\Services\ServiceInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

abstract class Service implements ServiceInterface
{
    public function __construct(protected string $modelClass)
    {
    }

    protected function newQuery(): Builder
    {
        return ($this->modelClass)::query();
    }

    public function save(array $validated): array
    {
        $model = $this->newQuery()->create($validated);

        return $model->exists
            ? ['success' => true, 'message' => 'Data berhasil ditambahkan']
            : ['success' => false, 'message' => 'Data gagal ditambahkan'];
    }

    public function update(Model $model, array $validated): array
    {
        return $model->update($validated)
            ? ['success' => true, 'message' => 'Data berhasil diupdate']
            : ['success' => false, 'message' => 'Data gagal diupdate'];
    }

    public function delete(Model $model): array
    {
        return $model->delete()
            ? ['success' => true, 'message' => 'Data berhasil dihapus']
            : ['success' => false, 'message' => 'Data gagal dihapus'];
    }
}
