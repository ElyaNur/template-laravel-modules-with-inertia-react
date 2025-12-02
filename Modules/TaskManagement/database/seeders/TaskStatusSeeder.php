<?php

namespace Modules\TaskManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'To Do',
                'slug' => 'to-do',
                'color' => '#94a3b8', // gray
                'sort' => 1,
                'is_default' => true,
                'is_completed' => false,
            ],
            [
                'name' => 'In Progress',
                'slug' => 'in-progress',
                'color' => '#3b82f6', // blue
                'sort' => 2,
                'is_default' => false,
                'is_completed' => false,
            ],
            [
                'name' => 'In Review',
                'slug' => 'in-review',
                'color' => '#f59e0b', // orange
                'sort' => 3,
                'is_default' => false,
                'is_completed' => false,
            ],
            [
                'name' => 'Done',
                'slug' => 'done',
                'color' => '#22c55e', // green
                'sort' => 4,
                'is_default' => false,
                'is_completed' => true,
            ],
        ];

        foreach ($statuses as $status) {
            TaskStatus::create($status);
        }
    }
}
