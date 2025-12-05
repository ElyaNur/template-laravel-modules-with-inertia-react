<?php

namespace Modules\TaskManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Settings\Menu;

class TaskManagementMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Create Task Management parent menu
        $taskManagementMenu = Menu::create([
            'nama' => 'Task Management',
            'keterangan' => 'Manage tasks, assignments and track progress',
            'sort' => 2, // Between dashboard (1) and settings (3)
            'icon' => 'clipboard-list',
            'is_active' => true,
            'permissions' => ['task:view-any'],
            'models' => [],
        ]);

        // Create "Projects" sub-menu
        Menu::create([
            'parent_id' => $taskManagementMenu->id,
            'nama' => 'Projects',
            'keterangan' => 'Organize tasks and workflows by project',
            'sort' => 1,
            'icon' => null,
            'is_active' => true,
            'permissions' => [],
            'models' => ['Modules\\TaskManagement\\Project'],
        ]);

        // Create "All Tasks" sub-menu
        Menu::create([
            'parent_id' => $taskManagementMenu->id,
            'nama' => 'All Tasks',
            'keterangan' => 'View and manage all tasks in list format',
            'sort' => 2,
            'icon' => null,
            'is_active' => true,
            'permissions' => [],
            'models' => ['Modules\\TaskManagement\\Task'],
        ]);

        // Create "Kanban Board" sub-menu
        Menu::create([
            'parent_id' => $taskManagementMenu->id,
            'nama' => 'Kanban Board',
            'keterangan' => 'Visual task board with drag and drop',
            'sort' => 3,
            'icon' => null,
            'is_active' => true,
            'permissions' => ['task:view-any'],
            'models' => [],
        ]);

        // Create "Task Statuses" sub-menu
        Menu::create([
            'parent_id' => $taskManagementMenu->id,
            'nama' => 'Task Statuses',
            'keterangan' => 'Manage Kanban board columns and task workflow',
            'sort' => 4,
            'icon' => null,
            'is_active' => true,
            'permissions' => ['task-status:view-any'],
            'models' => [],
        ]);

        $this->command->info('✓ Task Management menus created successfully!');
    }
}
