<?php

namespace Modules\Settings\Contracts\Services;

interface PermissionServiceInterface
{
    public function save(array $validated): array;

    public function getListPermission();
}
