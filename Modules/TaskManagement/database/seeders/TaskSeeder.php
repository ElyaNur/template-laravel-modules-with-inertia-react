<?php

namespace Modules\TaskManagement\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskStatus;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 5-15 sample tasks with random distribution across statuses.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        $statuses = TaskStatus::all();
        
        if ($statuses->isEmpty()) {
            $this->command->warn('No task statuses found. Please run TaskStatusSeeder first.');
            return;
        }

        // Generate random number of tasks between 5 and 15
        $taskCount = rand(5, 15);
        
        // Sample task titles and descriptions
        $taskTemplates = [
            ['title' => 'Design new landing page', 'description' => 'Create wireframes and mockups for the new landing page design.'],
            ['title' => 'Fix login bug', 'description' => 'Users are reporting issues with password reset functionality.'],
            ['title' => 'Update documentation', 'description' => 'Add API documentation for new endpoints.'],
            ['title' => 'Optimize database queries', 'description' => 'Improve performance of slow queries in the reporting module.'],
            ['title' => 'Implement dark mode', 'description' => 'Add dark mode toggle to user settings.'],
            ['title' => 'Write unit tests', 'description' => 'Add test coverage for task management module.'],
            ['title' => 'Code review', 'description' => 'Review pull requests from team members.'],
            ['title' => 'Deploy to staging', 'description' => 'Deploy latest changes to staging environment.'],
            ['title' => 'Client meeting', 'description' => 'Discuss project progress and next milestones.'],
            ['title' => 'Refactor authentication', 'description' => 'Simplify authentication logic and improve security.'],
            ['title' => 'Add email notifications', 'description' => 'Implement email notifications for task assignments.'],
            ['title' => 'Mobile responsiveness', 'description' => 'Make dashboard mobile-friendly.'],
            ['title' => 'Security audit', 'description' => 'Perform security review of the application.'],
            ['title' => 'Performance testing', 'description' => 'Load test the application under high traffic.'],
            ['title' => 'User feedback analysis', 'description' => 'Analyze and categorize user feedback from last sprint.'],
        ];

        $priorities = ['low', 'medium', 'high', 'urgent'];
        
        // Ensure at least one task per status
        $tasksPerStatus = [];
        foreach ($statuses as $status) {
            $tasksPerStatus[$status->id] = 0;
        }
        
        for ($i = 0; $i < $taskCount; $i++) {
            $template = $taskTemplates[array_rand($taskTemplates)];
            $creator = $users->random();
            $status = $statuses->random();
            
            // Track status distribution
            $tasksPerStatus[$status->id]++;
            
            // Random deadline (past, present, or future)
            $deadlineOptions = [
                now()->subDays(rand(1, 5)),  // Overdue
                now()->addDays(rand(1, 7)),  // Soon
                now()->addDays(rand(8, 30)), // Future
                null,                         // No deadline
            ];
            
            $task = Task::create([
                'title' => $template['title'] . ' #' . ($i + 1),
                'description' => $template['description'],
                'task_status_id' => $status->id,
                'priority' => $priorities[array_rand($priorities)],
                'created_by' => $creator->id,
                'deadline' => $deadlineOptions[array_rand($deadlineOptions)],
                'completed_at' => $status->is_completed ? now() : null,
                'sort' => $i,
            ]);

            // Assign 1-3 random users to the task
            $assignedCount = rand(1, min(3, $users->count()));
            $assignedUsers = $users->random($assignedCount);
            $task->assignedUsers()->attach($assignedUsers->pluck('id'));

            $this->command->info("Created task: {$task->title} ({$status->name})");
        }
        
        // Ensure at least one task per status
        foreach ($tasksPerStatus as $statusId => $count) {
            if ($count === 0) {
                $status = TaskStatus::find($statusId);
                $template = $taskTemplates[array_rand($taskTemplates)];
                $creator = $users->random();
                
                $task = Task::create([
                    'title' => $template['title'] . ' (Auto)',
                    'description' => $template['description'],
                    'task_status_id' => $statusId,
                    'priority' => $priorities[array_rand($priorities)],
                    'created_by' => $creator->id,
                    'deadline' => now()->addDays(rand(1, 14)),
                    'completed_at' => $status->is_completed ? now() : null,
                    'sort' => 999,
                ]);
                
                $assignedUsers = $users->random(rand(1, min(2, $users->count())));
                $task->assignedUsers()->attach($assignedUsers->pluck('id'));
                
                $this->command->info("Created additional task for status: {$status->name}");
            }
        }

        $this->command->info("Total tasks created: {$taskCount}");
    }
}
