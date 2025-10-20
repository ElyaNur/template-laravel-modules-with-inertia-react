<?php

namespace App\Providers;

use App\Contracts\Services\HelperServiceInterface;
use App\Services\HelperService;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $services = [
            HelperServiceInterface::class => HelperService::class,
        ];

        foreach ($services as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }
}
