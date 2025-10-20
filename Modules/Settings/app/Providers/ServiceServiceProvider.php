<?php

namespace Modules\Settings\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Settings\Contracts\Services\MenuServiceInterface;
use Modules\Settings\Contracts\Services\PermissionServiceInterface;
use Modules\Settings\Contracts\Services\RoleServiceInterface;
use Modules\Settings\Contracts\Services\UserServiceInterface;
use Modules\Settings\Services\MenuService;
use Modules\Settings\Services\PermissionService;
use Modules\Settings\Services\RoleService;
use Modules\Settings\Services\UserService;

class ServiceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $services = [
            MenuServiceInterface::class => MenuService::class,
            PermissionServiceInterface::class => PermissionService::class,
            RoleServiceInterface::class => RoleService::class,
            UserServiceInterface::class => UserService::class,
        ];

        foreach ($services as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }
}
