import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectData, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { KanbanSquare, Plus } from 'lucide-react';
import { ReactNode } from 'react';
import { columns } from './columns';
import { useTaskTable } from './hooks/use-task-table';
import { ProjectSelector } from '@/components/project-selector';

const TaskIndex = () => {
    const { tasks, projects, selectedProject } = usePage<SharedData & {
        projects: ProjectData[];
        selectedProject: number | null;
    }>().props;
    const hooks = useTaskTable({ data: tasks });

    const handleProjectChange = (projectId: number) => {
        router.get('/task-management/all-tasks', { project_id: projectId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Tasks" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>Manage your tasks and track progress</CardDescription>
                        </div>
                        {projects && projects.length > 0 && (
                            <ProjectSelector
                                projects={projects}
                                selectedProjectId={selectedProject}
                                onProjectChange={handleProjectChange}
                            />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/task-management/kanban-board${selectedProject ? `?project_id=${selectedProject}` : ''}`}>
                                <KanbanSquare className="mr-2 h-4 w-4" />
                                Kanban Board
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/task-management/all-tasks/create${selectedProject ? `?project_id=${selectedProject}` : ''}`}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} hooks={hooks} />
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
    },
];

TaskIndex.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default TaskIndex;
