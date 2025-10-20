<?php

namespace Modules\Settings\Services;

use Modules\Settings\Contracts\Services\PermissionServiceInterface;
use Spatie\Permission\Models\Permission;

class PermissionService implements PermissionServiceInterface
{
    public function getListPermission()
    {
        return cache()->tags('permissions')->remember(
            'permissions',
            now()->addHours(12),
            fn () => Permission::all()->map(fn ($permission) => [
                'value' => $permission->name,
                'label' => $permission->name,
            ])
        );
    }

    public function save(array $validated): array
    {
        cache()->tags('permissions')->flush();

        return Permission::create($validated)->exists
            ? ['success' => true, 'message' => 'Permission berhasil disimpan']
            : ['success' => false, 'message' => 'Permission gagal disimpan'];
    }
}
