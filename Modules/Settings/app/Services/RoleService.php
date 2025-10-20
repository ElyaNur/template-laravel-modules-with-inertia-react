<?php

namespace Modules\Settings\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Log;
use Modules\Settings\Contracts\Services\RoleServiceInterface;
use Modules\Settings\Menu;
use Modules\Settings\Role;
use ReflectionClass;
use Throwable;

class RoleService implements RoleServiceInterface
{
    public function getRoles(): LengthAwarePaginator
    {
        $filter = request('filter');
        $sort = request('sort');

        return Role::query()
            ->when(
                $filter,
                fn ($query, $filter) => $query->where('name', 'like', "%$filter%")
            )
            ->when(
                $sort,
                function ($query, $sort) {
                    $exploded = explode(':', $sort);
                    $query->orderBy($exploded[0], $exploded[1]);
                },
                fn ($query) => $query->orderByDesc('id')
            )
            ->paginate(10);
    }

    public function getListRole()
    {
        return cache()->tags('roles')->remember(
            'roles',
            now()->addHours(12),
            fn () => Role::where('name', '!=', 'super admin')
                ->get()
                ->map(fn ($role) => [
                    'value' => $role->id,
                    'label' => $role->name,
                ])
        );
    }

    public function getListMenuWithPermissions(?Role $role = null)
    {
        $menus = Menu::orderBy('sort')->get()
            ->map(fn ($menu) => [
                ...$menu->toArray(),
                'permissions' => $this->mapPermissions($menu, $role),
            ]);

        return $menus->map(function ($item) {
            $item['permissions'] = $item['permissions']
                ->filter(fn ($permission) => $permission['listPermission']->isNotEmpty())
                ->values();

            return $item;
        })->filter()->values();
    }

    public function save(array $validated): array
    {
        try {
            DB::transaction(function () use ($validated): void {
                $role = Role::create($validated);
                $role->syncPermissions($validated['permissions']);
            });

            return ['success' => true, 'message' => 'Role berhasil ditambahkan'];
        } catch (Throwable $e) {
            Log::error($e->getMessage());

            return ['success' => false, 'message' => 'Role gagal ditambahkan'];
        }
    }

    public function update(Role|Model $model, array $validated): array
    {
        try {
            DB::transaction(function () use ($model, $validated): void {
                $model->update($validated);
                $model->syncPermissions($validated['permissions']);
            });

            return ['success' => true, 'message' => 'Role berhasil diubah'];
        } catch (Throwable $e) {
            Log::error($e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal mengupdate Role',
            ];
        }
    }

    public function delete(Model $model): array
    {
        return $model->delete()
            ? ['success' => true, 'message' => 'Role berhasil dihapus']
            : ['success' => false, 'message' => 'Role gagal dihapus'];
    }

    private function mapPermissions(Menu $menu, ?Role $role)
    {
        $models = $menu->models?->map(fn ($model) => [
            'name' => $model,
            'listPermission' => Gate::getPolicyFor($model)
                ? collect((new ReflectionClass(Gate::getPolicyFor($model)))->getMethods())
                    ->pluck('name')
                    ->filter(fn ($method) => ! in_array($method, ['allow', 'deny', 'denyWithStatus', 'denyAsNotFound']))
                    ->map(fn ($permission) => [
                        'label' => ucwords(Str::snake($permission, ' ')),
                        'value' => Str::kebab(class_basename($model)).':'.Str::kebab($permission),
                        'isCheck' => $role && $role->hasPermissionTo(Str::kebab(class_basename($model)).':'.Str::kebab($permission)),
                    ])
                : collect(),
        ]);

        $permissions = $menu->permissions ? collect([[
            'name' => $menu->nama,
            'listPermission' => $menu->permissions?->map(function ($permission) use ($role) {
                    $partPermission = explode(':', $permission);

                    return [
                        'label' => ucwords(Str::snake($partPermission[1], ' ')),
                        'value' => $permission,
                        'isCheck' => $role && $role->hasPermissionTo(is_array($permission) ? $permission['value'] : $permission),
                    ];
                }) ?? collect(),
        ]]) : collect();

        return $models->merge($permissions);
    }
}
