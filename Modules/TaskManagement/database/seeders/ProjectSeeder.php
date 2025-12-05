<?php

namespace Modules\TaskManagement\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Modules\TaskManagement\Models\Project;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskStatus;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            echo "No users found. Creating projects skipped.\n";
            return;
        }

        $projects = [
            [
                'name' => 'Website Redesign',
                'slug' => 'website-redesign',
                'description' => 'Complete overhaul of the company website with modern design and improved UX.',
                'color' => '#3b82f6', // Blue
            ],
            [
                'name' => 'Mobile App Development',
                'slug' => 'mobile-app-development',
                'description' => 'Development of iOS and Android mobile applications for our platform.',
                'color' => '#10b981', // Green
            ],
            [
                'name' => 'Marketing Campaign Q1',
                'slug' => 'marketing-campaign-q1',
                'description' => 'Q1 marketing initiatives including social media, email campaigns, and content creation.',
                'color' => '#f59e0b', // Orange
            ],
            [
                'name' => 'Infrastructure Upgrade',
                'slug' => 'infrastructure-upgrade',
                'description' => 'Server migration and infrastructure improvements for better performance and scalability.',
                'color' => '#8b5cf6', // Purple
            ],
            [
                'name' => 'Customer Portal',
                'slug' => 'customer-portal',
                'description' => 'Self-service customer portal for account management and support.',
                'color' => '#ec4899', // Pink
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create([
                'name' => $projectData['name'],
                'slug' => $projectData['slug'],
                'description' => $projectData['description'],
                'color' => $projectData['color'],
                'created_by' => $user->id,
                'is_archived' => false,
            ]);

            // Create default statuses for this project
            $this->createDefaultStatuses($project);
            
            // Create sample tasks for this project
            $this->createSampleTasks($project, $user);
        }
    }

    /**
     * Create default task statuses for a project.
     */
    private function createDefaultStatuses(Project $project): void
    {
        $statuses = [
            ['name' => 'To Do', 'slug' => 'to-do', 'color' => '#94a3b8', 'sort' => 1, 'is_default' => true],
            ['name' => 'In Progress', 'slug' => 'in-progress', 'color' => '#3b82f6', 'sort' => 2],
            ['name' => 'In Review', 'slug' => 'in-review', 'color' => '#f59e0b', 'sort' => 3],
            ['name' => 'Done', 'slug' => 'done', 'color' => '#10b981', 'sort' => 4, 'is_completed' => true],
        ];

        foreach ($statuses as $statusData) {
            TaskStatus::create([
                'project_id' => $project->id,
                'name' => $statusData['name'],
                'slug' => $statusData['slug'],
                'color' => $statusData['color'],
                'sort' => $statusData['sort'],
                'is_default' => $statusData['is_default'] ?? false,
                'is_completed' => $statusData['is_completed'] ?? false,
            ]);
        }
    }

    /**
     * Create sample tasks for a project.
     */
    private function createSampleTasks(Project $project, User $user): void
    {
        $statuses = TaskStatus::where('project_id', $project->id)->get();
        
        $taskTemplates = [
            ['title' => 'Research and analysis', 'priority' => 'medium'],
            ['title' => 'Create wireframes', 'priority' => 'high'],
            ['title' => 'Design mockups', 'priority' => 'high'],
            ['title' => 'Develop frontend components', 'priority' => 'medium'],
            ['title' => 'Backend API integration', 'priority' => 'high'],
            ['title' => 'Write unit tests', 'priority' => 'medium'],
            ['title' => 'Code review and refactoring', 'priority' => 'low'],
            ['title' => 'User acceptance testing', 'priority' => 'urgent'],
            ['title' => 'Deploy to staging', 'priority' => 'medium'],
            ['title' => 'Documentation update', 'priority' => 'low'],
            ['title' => 'Performance optimization', 'priority' => 'high'],
            ['title' => 'Security audit', 'priority' => 'urgent'],
            ['title' => 'Stakeholder presentation', 'priority' => 'medium'],
            ['title' => 'Deploy to production', 'priority' => 'urgent'],
            ['title' => 'Post-launch monitoring', 'priority' => 'high'],
        ];

        // Randomly select 5-15 tasks
        $numTasks = rand(5, 15);
        $selectedTemplates = collect($taskTemplates)->shuffle()->take($numTasks);

        $sort = 0;
        foreach ($selectedTemplates as $template) {
            // Randomly assign to a status
            $status = $statuses->random();
            
            $task = Task::create([
                'project_id' => $project->id,
                'title' => $template['title'],
                'description' => 'Task for ' . $project->name . ': ' . $template['title'],
                'task_status_id' => $status->id,
                'priority' => $template['priority'],
                'created_by' => $user->id,
                'deadline' => rand(0, 1) ? now()->addDays(rand(1, 30)) : null,
                'completed_at' => $status->is_completed ? now()->subDays(rand(1, 7)) : null,
                'sort' => $sort++,
            ]);

            // Randomly assign the task to the creator
            if (rand(0, 1)) {
                $task->assignedUsers()->attach($user->id);
            }
        }
    }
}
