<?php

use Illuminate\Support\Facades\Route;
use Modules\TaskManagement\Http\Controllers\ProjectController;
use Modules\TaskManagement\Http\Controllers\TaskAttachmentController;
use Modules\TaskManagement\Http\Controllers\TaskCommentController;
use Modules\TaskManagement\Http\Controllers\TaskController;
use Modules\TaskManagement\Http\Controllers\TaskDependencyController;
use Modules\TaskManagement\Http\Controllers\TaskStatusController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('task-management')->name('task-management.')->group(function () {
        // Project routes
        Route::prefix('projects')->name('projects.')->group(function () {
            Route::get('/', [ProjectController::class, 'index'])->name('index');
            Route::get('/create', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
            Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
            Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
            Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
            Route::patch('/{project}/archive', [ProjectController::class, 'archive'])->name('archive');
        });
        
        // All Tasks routes (kept for backward compatibility)
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
            
            // Task Comments
            Route::prefix('/{task}/comments')->name('comments.')->group(function () {
                Route::post('/', [TaskCommentController::class, 'store'])->name('store');
                Route::put('/{comment}', [TaskCommentController::class, 'update'])->name('update');
                Route::delete('/{comment}', [TaskCommentController::class, 'destroy'])->name('destroy');
            });
            
            // Task Attachments
            Route::prefix('/{task}/attachments')->name('attachments.')->group(function () {
                Route::post('/', [TaskAttachmentController::class, 'store'])->name('store');
            });
            
            // Task Dependencies
            Route::prefix('/{task}/dependencies')->name('dependencies.')->group(function () {
                Route::get('/', [TaskDependencyController::class, 'index'])->name('index');
                Route::post('/', [TaskDependencyController::class, 'store'])->name('store');
                Route::delete('/{dependency}', [TaskDependencyController::class, 'destroy'])->name('destroy');
            });
        });
        
        // Kanban Board routes (kept for backward compatibility)
        Route::prefix('kanban-board')->name('kanban-board.')->group(function () {
            Route::get('/', [TaskController::class, 'kanban'])->name('index');
        });
        
        // Status management (kept for backward compatibility)
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
        
        // Attachment routes (global, not scoped to tasks)
        Route::get('/attachments/{attachment}/download', [TaskAttachmentController::class, 'download'])
            ->name('attachments.download');
        Route::delete('/attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])
            ->name('attachments.destroy');
    });
});
