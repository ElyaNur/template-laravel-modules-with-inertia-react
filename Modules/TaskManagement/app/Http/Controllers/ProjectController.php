<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\TaskManagement\Http\Requests\ProjectRequest;
use Modules\TaskManagement\Models\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::with('creator')
            ->withCount(['tasks', 'taskStatuses'])
            ->latest()
            ->get();

        return Inertia::render('TaskManagement::projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        return Inertia::render('TaskManagement::projects/create');
    }

    /**
     * Store a newly created project.
     */
    public function store(ProjectRequest $request): RedirectResponse
    {
        $project = Project::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'color' => $request->color,
            'created_by' => auth()->id(),
            'is_archived' => false,
        ]);

        // Create default task statuses for the new project
        $this->createDefaultStatuses($project);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'creator',
            'taskStatuses' => fn($q) => $q->sorted(),
            'tasks' => fn($q) => $q->with(['status', 'assignedUsers'])->sorted(),
        ]);

        return Inertia::render('TaskManagement::projects/show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        return Inertia::render('TaskManagement::projects/edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());

        return redirect()->back()
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * Toggle archive status of the project.
     */
    public function archive(Project $project): RedirectResponse
    {
        if ($project->is_archived) {
            $project->unarchive();
            $message = 'Project unarchived successfully.';
        } else {
            $project->archive();
            $message = 'Project archived successfully.';
        }

        return redirect()->back()
            ->with('success', $message);
    }

    /**
     * Create default task statuses for a new project.
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
            $project->taskStatuses()->create($statusData);
        }
    }
}
