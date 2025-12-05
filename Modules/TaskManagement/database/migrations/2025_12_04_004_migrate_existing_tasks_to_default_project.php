<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get the first user to assign as project creator
        $firstUserId = DB::table('users')->orderBy('id')->value('id');
        
        // If no users exist, skip creating default project - seeders will handle it
        if (!$firstUserId) {
            // Just make the columns NOT NULL for database schema consistency
            Schema::table('task_statuses', function (Blueprint $table) {
                $table->foreignId('project_id')->nullable(false)->change();
            });
            
            Schema::table('tasks', function (Blueprint $table) {
                $table->foreignId('project_id')->nullable(false)->change();
            });
            return;
        }

        // Create default project only if there are existing tasks or statuses
        $hasExistingData = DB::table('task_statuses')->whereNull('project_id')->exists() ||
                           DB::table('tasks')->whereNull('project_id')->exists();
        
        if ($hasExistingData) {
            // Create default project for existing data
            $projectId = DB::table('projects')->insertGetId([
                'name' => 'Default Project',
                'slug' => 'default-project',
                'description' => 'Automatically created project for existing tasks and statuses.',
                'color' => '#3b82f6',
                'created_by' => $firstUserId,
                'is_archived' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign all existing task statuses to the default project
            DB::table('task_statuses')
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);

            // Assign all existing tasks to the default project
            DB::table('tasks')
                ->whereNull('project_id')
                ->update(['project_id' => $projectId]);
        }

        // Make project_id NOT NULL after data migration
        Schema::table('task_statuses', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable(false)->change();
        });
        
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Make project_id nullable again
        Schema::table('task_statuses', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->change();
        });
        
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->change();
        });

        // Remove default project
        DB::table('projects')->where('slug', 'default-project')->delete();
    }
};
