<?php

use App\Http\Controllers\CommentImageController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//Route::middleware(['auth', 'verified'])->group(function () {
//    Route::get('dashboard', function () {
//        return Inertia::render('dashboard');
//    })->name('dashboard');
//});

// Application Feature Routes (Authenticated)
Route::middleware('auth')->group(function () {
    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    
    // Comment Images (for markdown editor)
    Route::post('api/comment-images', [CommentImageController::class, 'store'])->name('comment-images.store');
    Route::get('api/comment-images/{uuid}', [CommentImageController::class, 'show'])->name('comment-images.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
