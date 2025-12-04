<?php

use Illuminate\Support\Facades\Route;
use Modules\TaskManagement\Http\Controllers\TaskController;
use Modules\TaskManagement\Http\Controllers\TaskStatusController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('task-management')->name('task-management.')->group(function () {
        // All Tasks routes
        Route::prefix('all-tasks')->name('all-tasks.')->group(function () {
            Route::get('/', [TaskController::class, 'index'])->name('index');
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
        });
        
        // Kanban Board routes
        Route::prefix('kanban-board')->name('kanban-board.')->group(function () {
            Route::get('/', [TaskController::class, 'kanban'])->name('index');
        });
        
        // Status management
        Route::prefix('task-statuses')->name('task-statuses.')->group(function () {
            Route::get('/', [TaskStatusController::class, 'index'])->name('index');
            Route::get('/create', [TaskStatusController::class, 'create'])->name('create');
            Route::post('/', [TaskStatusController::class, 'store'])->name('store');
            Route::get('/{taskStatus}/edit', [TaskStatusController::class, 'edit'])->name('edit');
            Route::put('/{taskStatus}', [TaskStatusController::class, 'update'])
                ->name('update');
            Route::delete('/{taskStatus}', [TaskStatusController::class, 'destroy'])
                ->name('destroy');
            Route::patch('/reorder', [TaskStatusController::class, 'reorder'])
                ->name('reorder');
        });
    });
});
