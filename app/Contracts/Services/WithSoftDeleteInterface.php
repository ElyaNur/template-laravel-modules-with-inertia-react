<?php

namespace App\Contracts\Services;

interface WithSoftDeleteInterface
{
    public function restore(int $id): array;

    public function forceDelete(int $id): array;

    public function deleteBulk(array $ids): array;
}
