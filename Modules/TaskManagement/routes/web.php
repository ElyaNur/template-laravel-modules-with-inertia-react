<?php

use Illuminate\Support\Facades\Route;
use Modules\TaskManagement\Http\Controllers\TaskController;
use Modules\TaskManagement\Http\Controllers\TaskStatusController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('tasks')->name('tasks.')->group(function () {
        // Main views
        Route::get('/', [TaskController::class, 'index'])->name('index');
        Route::get('/kanban', [TaskController::class, 'kanban'])->name('kanban');
        
        // CRUD operations
        Route::get('/create', [TaskController::class, 'create'])->name('create');
        Route::post('/', [TaskController::class, 'store'])->name('store');
        Route::get('/{task}', [TaskController::class, 'show'])->name('show');
        Route::get('/{task}/edit', [TaskController::class, 'edit'])->name('edit');
        Route::put('/{task}', [TaskController::class, 'update'])->name('update');
        Route::delete('/{task}', [TaskController::class, 'destroy'])->name('destroy');
        
        // Special actions
        Route::patch('/{task}/status', [TaskController::class, 'updateStatus'])
            ->name('update-status');
        Route::patch('/{task}/complete', [TaskController::class, 'markAsCompleted'])
            ->name('complete');
        
        // Status management
        Route::prefix('statuses')->name('statuses.')->group(function () {
            Route::get('/', [TaskStatusController::class, 'index'])->name('index');
            Route::post('/', [TaskStatusController::class, 'store'])->name('store');
            Route::put('/{taskStatus}', [TaskStatusController::class, 'update'])
                ->name('update');
            Route::delete('/{taskStatus}', [TaskStatusController::class, 'destroy'])
                ->name('destroy');
            Route::post('/reorder', [TaskStatusController::class, 'reorder'])
                ->name('reorder');
        });
    });
});
