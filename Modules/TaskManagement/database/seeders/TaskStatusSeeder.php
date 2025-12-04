<?php

namespace Modules\TaskManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\TaskManagement\Models\TaskStatus;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'slug' => 'to-do',
                'name' => 'To Do',
                'color' => '#94a3b8',
                'sort' => 1,
                'is_default' => true,
                'is_completed' => false,
            ],
            [
                'slug' => 'in-progress',
                'name' => 'In Progress',
                'color' => '#3b82f6',
                'sort' => 2,
                'is_default' => false,
                'is_completed' => false,
            ],
            [
                'slug' => 'in-review',
                'name' => 'In Review',
                'color' => '#f59e0b',
                'sort' => 3,
                'is_default' => false,
                'is_completed' => false,
            ],
            [
                'slug' => 'done',
                'name' => 'Done',
                'color' => '#10b981',
                'sort' => 4,
                'is_default' => false,
                'is_completed' => true,
            ],
        ];

        foreach ($statuses as $status) {
            TaskStatus::updateOrCreate(
                ['slug' => $status['slug']],
                $status
            );
        }

        $this->command->info('✓ Task statuses created/updated successfully!');
    }
}
