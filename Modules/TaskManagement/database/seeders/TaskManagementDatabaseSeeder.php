<?php

namespace Modules\TaskManagement\Database\Seeders;

use Illuminate\Database\Seeder;

class TaskManagementDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ProjectSeeder will create projects with their own task statuses and tasks
        $this->call([
            ProjectSeeder::class,
            TaskManagementMenuSeeder::class,
        ]);
    }
}
