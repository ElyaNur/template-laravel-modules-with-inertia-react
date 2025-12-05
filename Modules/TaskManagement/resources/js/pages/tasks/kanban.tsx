import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectData, KanbanStatusData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { List, Plus } from 'lucide-react';
import { ReactNode } from 'react';
import KanbanBoard from '../../components/kanban/kanban-board';
import { ProjectSelector } from '@/components/project-selector';

type PageProps = {
    kanbanData: KanbanStatusData[];
    users: Array<{ id: number; name: string; email: string }>;
    projects: ProjectData[];
    selectedProject: number | null;
    filters: {
        assigned_to?: number;
        priority?: string;
    };
};

const KanbanView = () => {
    const { kanbanData, users, projects, selectedProject, filters } = usePage<PageProps>().props;

    const handleProjectChange = (projectId: number) => {
        router.get('/task-management/kanban-board', { project_id: projectId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Kanban Board" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CardTitle>Kanban Board</CardTitle>
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
                            <Link href={` /task-management/all-tasks${selectedProject ? `?project_id=${selectedProject}` : ''}`}>
                                <List className="mr-2 h-4 w-4" />
                                List View
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
                    <KanbanBoard statuses={kanbanData} />
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task-management/all-tasks',
    },
    {
        title: 'Kanban',
    },
];

KanbanView.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default KanbanView;
