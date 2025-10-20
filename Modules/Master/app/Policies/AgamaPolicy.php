<?php

namespace Modules\Master\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AgamaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('agama:view-any');
    }

    public function view(User $user): bool
    {
        return $user->can('agama:view');
    }

    public function create(User $user): bool
    {
        return $user->can('agama:create');
    }

    public function update(User $user): bool
    {
        return $user->can('agama:update');
    }

    public function delete(User $user): bool
    {
        return $user->can('agama:delete');
    }

    public function restore(User $user): bool
    {
        return $user->can('agama:restore');
    }

    public function forceDelete(User $user): bool
    {
        return $user->can('agama:force-delete');
    }
}
