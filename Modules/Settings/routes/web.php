<?php

use Illuminate\Support\Facades\Route;
use Modules\Settings\Http\Controllers\MenuController;
use Modules\Settings\Http\Controllers\RoleController;
use Modules\Settings\Http\Controllers\StorePermissionController;
use Modules\Settings\Http\Controllers\UserController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('auth')->name('settings.')
        ->prefix('settings')
        ->group(function () {

            Route::name('menu.')
                ->controller(MenuController::class)
                ->prefix('menu')
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('create', 'create')->name('create');
                    Route::get('next-sort/{menu?}', 'getNextSort')->name('next-sort');
                    Route::get('{menu}', 'show')->name('show');
                    Route::get('{menu}/edit', 'edit')->name('edit');
                    Route::post('/', 'store')->name('store');
                    Route::put('{menu}', 'update')->name('update');
                    Route::patch('{menu}/restore', 'restore')->name('restore');
                    Route::delete('destroy-bulk', 'destroyBulk')->name('destroy.bulk');
                    Route::delete('{menu}/force-destroy', 'forceDestroy')->name('force-destroy');
                    Route::delete('{menu}', 'destroy')->name('destroy');

                });

            Route::post('permission', StorePermissionController::class)->name('permission.store');

            Route::name('user.')
                ->controller(UserController::class)
                ->prefix('user')
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('create', 'create')->name('create');
                    Route::get('{user}', 'show')->name('show');
                    Route::get('{user}/edit', 'edit')->name('edit');
                    Route::post('/', 'store')->name('store');
                    Route::put('{user}', 'update')->name('update');
                    Route::patch('{user}/restore', 'restore')->name('restore');
                    Route::delete('destroy-bulk', 'destroyBulk')->name('destroy.bulk');
                    Route::delete('{user}/force-destroy', 'forceDestroy')->name('force-destroy');
                    Route::delete('{user}', 'destroy')->name('destroy');
                });

            Route::name('role.')
                ->controller(RoleController::class)
                ->prefix('role')
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('create', 'create')->name('create');
                    Route::get('{role}', 'show')->name('show');
                    Route::get('{role}/edit', 'edit')->name('edit');
                    Route::post('/', 'store')->name('store');
                    Route::put('{role}', 'update')->name('update');
                    Route::delete('{role}', 'destroy')->name('destroy');

                });

            //Route::name('setting.')
            //    ->controller(SettingController::class)
            //    ->prefix('setting')
            //    ->group(function () {
            //        Route::get('/', 'index')->name('index');
            //        Route::put('/', 'update')->name('update');
            //    });
        });
});
