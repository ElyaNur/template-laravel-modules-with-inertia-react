<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // e.g., "To Do", "In Progress", "Done"
            $table->string('slug');            // e.g., "to-do", "in-progress", "done" (unique per project)
            $table->string('color', 7);       // Hex color for UI, e.g., "#3b82f6"
            $table->integer('sort')->default(0);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_completed')->default(false); // Marks task as completed
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_statuses');
    }
};
