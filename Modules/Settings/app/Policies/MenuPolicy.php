<?php

namespace Modules\Settings\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MenuPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('menu:view-any');
    }

    public function view(User $user): bool
    {
        return $user->can('menu:view');
    }

    public function create(User $user): bool
    {
        return $user->can('menu:create');
    }

    public function update(User $user): bool
    {
        return $user->can('menu:update');
    }

    public function delete(User $user): bool
    {
        return $user->can('menu:delete');
    }

    public function restore(User $user): bool
    {
        return $user->can('menu:restore');
    }

    public function forceDelete(User $user): bool
    {
        return $user->can('menu:force-delete');
    }
}
