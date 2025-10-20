<?php

namespace App\Services;

use App\Contracts\Services\WithSoftDeleteInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class ServiceWithSoftDelete extends Service implements WithSoftDeleteInterface
{
    protected function assertSoftDeletes(): void
    {
        if (! in_array(SoftDeletes::class, class_uses_recursive($this->modelClass), true)) {
            throw new \LogicException("{$this->modelClass} does not use SoftDeletes.");
        }
    }

    public function restore(int $id): array
    {
        $this->assertSoftDeletes();
        $count = $this->newQuery()->onlyTrashed()->whereKey($id)->restore();

        return $count > 0
            ? ['success' => true,  'message' => 'Data berhasil direstore']
            : ['success' => false, 'message' => 'Data gagal direstore'];
    }

    public function forceDelete(int $id): array
    {
        $this->assertSoftDeletes();
        $count = $this->newQuery()->onlyTrashed()->whereKey($id)->forceDelete();

        return $count > 0
            ? ['success' => true,  'message' => 'Data berhasil dihapus permanen']
            : ['success' => false, 'message' => 'Data gagal dihapus permanen'];
    }

    public function deleteBulk(array $ids): array
    {
        $count = $this->newQuery()->whereKey(Arr::wrap($ids))->delete();

        return $count > 0
            ? ['success' => true,  'message' => 'Data berhasil dihapus']
            : ['success' => false, 'message' => 'Data gagal dihapus'];
    }
}
