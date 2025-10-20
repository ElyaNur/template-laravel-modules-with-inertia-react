<?php

namespace Modules\Settings\Services;

use App\Models\User;
use App\Services\ServiceWithSoftDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Modules\Settings\Contracts\Services\UserServiceInterface;
use Modules\Settings\Role;
use Override;

final class UserService extends ServiceWithSoftDelete implements UserServiceInterface
{
    public function __construct()
    {
        parent::__construct(User::class);
    }
    public function getUsers(): LengthAwarePaginator
    {
        $filter = request('filter');
        $sort = request('sort');
        $withTrashed = request('withTrashed', 'without-trashed');

        return User::query()
            ->mereHuman()
            ->with('roles')
            ->when(
                $filter,
                fn ($query, $filter) => $query->where('nama', 'like', "%$filter%")
            )
            ->when(
                $sort,
                function ($query, $sort) {
                    $exploded = explode(':', $sort);
                    $query->orderBy($exploded[0], $exploded[1]);
                },
                fn ($query) => $query->orderByDesc('id')
            )
            ->when(
                $withTrashed !== 'without-trashed',
                fn ($query) => $query
                    ->when(
                        $withTrashed === 'only-trashed',
                        fn ($query) => $query->onlyTrashed(),
                        fn ($query) => $query->withTrashed()
                    )
            )
            ->paginate(10);
    }

    #[Override]
    public function save(array $validated): array
    {
        $validated['password'] = Hash::make('12345678');

        $user = User::create($validated);

        if (! $user->exists) {
            return ['success' => false, 'message' => 'User gagal ditambahkan'];
        }

        $roles = Role::find($validated['roles'])
            ->pluck('name')
            ->map(fn ($role) => mb_strtolower($role))
            ->toArray();

        $user->syncRoles($roles);

        return ['success' => true, 'message' => 'User berhasil ditambahkan'];
    }

    #[Override]
    public function update(User|Model $model, array $validated): array
    {
        if (! $model->update($validated)) {
            return ['success' => false, 'message' => 'User gagal diubah'];
        }

        $roles = Role::find($validated['roles'])
            ->pluck('name')
            ->toArray();

        $model->syncRoles($roles);

        return $model->update($validated)
            ? ['success' => true, 'message' => 'User berhasil diubah']
            : ['success' => false, 'message' => 'User gagal diubah'];
    }

}
