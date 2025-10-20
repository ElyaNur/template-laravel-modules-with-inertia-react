<?php

namespace Modules\Master\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Master\Contracts\Services\AgamaServiceInterface;
use Modules\Master\Services\AgamaService;

class ServiceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $services = [
            AgamaServiceInterface::class => AgamaService::class,
        ];

        foreach ($services as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }
}
