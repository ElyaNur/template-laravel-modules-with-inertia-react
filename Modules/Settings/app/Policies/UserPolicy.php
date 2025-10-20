<?php

namespace Modules\Settings\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('user:view-any');
    }

    public function view(User $user): bool
    {
        return $user->can('user:view');
    }

    public function create(User $user): bool
    {
        return $user->can('user:create');
    }

    public function update(User $user): bool
    {
        return $user->can('user:update');
    }

    public function delete(User $user): bool
    {
        return $user->can('user:delete');
    }

    public function restore(User $user): bool
    {
        return $user->can('user:restore');
    }

    public function forceDelete(User $user): bool
    {
        return $user->can('user:force-delete');
    }
}
