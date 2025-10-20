<?php

namespace Modules\Settings\Contracts\Services;

use App\Contracts\Services\ServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Settings\Role;

interface RoleServiceInterface extends ServiceInterface
{
    public function getRoles(): LengthAwarePaginator;

    public function getListRole();

    public function getListMenuWithPermissions(?Role $role = null);
}
