<?php

namespace Modules\Settings\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('role:view-any');
    }

    public function view(User $user): bool
    {
        return $user->can('role:view');
    }

    public function create(User $user): bool
    {
        return $user->can('role:create');
    }

    public function update(User $user): bool
    {
        return $user->can('role:update');
    }

    public function delete(User $user): bool
    {
        return $user->can('role:delete');
    }

    public function restore(User $user): bool
    {
        return $user->can('role:restore');
    }

    public function forceDelete(User $user): bool
    {
        return $user->can('role:force-delete');
    }
}
