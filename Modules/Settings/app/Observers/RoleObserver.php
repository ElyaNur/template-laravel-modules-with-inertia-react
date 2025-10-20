<?php

namespace Modules\Settings\Observers;

use Modules\Settings\Role;

class RoleObserver
{
    public function created(Role $role): void
    {
        cache()->tags('roles')->flush();
    }

    public function updated(Role $role): void
    {
        cache()->tags('roles')->flush();
    }

    public function deleted(Role $role): void
    {
        cache()->tags('roles')->flush();
    }

    public function restored(Role $role): void
    {
        cache()->tags('roles')->flush();
    }
}
