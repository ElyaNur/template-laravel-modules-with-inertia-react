<?php

use Illuminate\Support\Facades\Route;
use Modules\Master\Http\Controllers\AgamaController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::name('master.')
        ->prefix('master')
        ->group(function () {
            Route::get('/', [AgamaController::class, 'index'])->name('index');

            Route::name('agama.')
                ->controller(AgamaController::class)
                ->prefix('agama')
                ->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('create', 'create')->name('create');
                    Route::get('get-list-agama', 'getListAgama')->name('get-list-agama');
                    Route::get('{agama}', 'show')->name('show');
                    Route::get('{agama}/edit', 'edit')->name('edit');
                    Route::post('/', 'store')->name('store');
                    Route::put('{agama}', 'update')->name('update');
                    Route::patch('{agama}/restore', 'restore')->name('restore');
                    Route::delete('destroy-bulk', 'destroyBulk')->name('destroy.bulk');
                    Route::delete('{agama}/force-destroy', 'forceDestroy')->name('force-destroy');
                    Route::delete('{agama}', 'destroy')->name('destroy');
                });

        });
});
