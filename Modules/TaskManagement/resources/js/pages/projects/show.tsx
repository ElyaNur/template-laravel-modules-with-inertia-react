import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectData, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Archive, Edit, Trash2, CheckCircle2, Clock, BarChart3 } from 'lucide-react';

type ProjectWithRelations = ProjectData & {
    tasks: Array<{
        id: number;
        title: string;
        priority: string;
        status: {
            name: string;
            color: string;
        };
    }>;
    taskStatuses: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
        tasks_count: number;
    }>;
};

const ProjectShow = () => {
    const { project } = usePage<SharedData & { project: ProjectWithRelations }>().props;
    const handleArchive = () => {
        router.patch(`/task-management/projects/${project.id}/archive`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project? All tasks and statuses will be deleted.')) {
            router.delete(`/task-management/projects/${project.id}`);
        }
    };

    return (
        <>
            <Head title={project.name} />

            {/* Project Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: project.color }}
                                />
                                <CardTitle className="text-2xl">{project.name}</CardTitle>
                                {project.is_archived && <Badge variant="secondary">Archived</Badge>}
                            </div>
                            {project.description && (
                                <CardDescription className="text-base mt-2">{project.description}</CardDescription>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleArchive}>
                                <Archive className="h-4 w-4 mr-2" />
                                {project.is_archived ? 'Unarchive' : 'Archive'}
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/task-management/projects/${project.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    Total Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{project.tasks?.length || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Task Statuses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{project.taskStatuses?.length || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    Created By
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">{project.creator?.name || 'Unknown'}</div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="statuses" className="mt-6">
                <TabsList>
                    <TabsTrigger value="statuses">Statuses ({project.taskStatuses?.length || 0})</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks ({project.tasks?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="statuses" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Statuses</CardTitle>
                            <CardDescription>Workflow stages for this project</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {project.taskStatuses?.map((status) => (
                                    <div
                                        key={status.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: status.color }}
                                            />
                                            <span className="font-medium">{status.name}</span>
                                        </div>
                                        <Badge variant="secondary">{status.tasks_count || 0} tasks</Badge>
                                    </div>
                                ))}
                                {(!project.taskStatuses || project.taskStatuses.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No statuses yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks</CardTitle>
                            <CardDescription>All tasks in this project</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {project.tasks?.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                                    >
                                        <div className="space-y-1">
                                            <div className="font-medium">{task.title}</div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: task.status.color }}
                                                />
                                                <span className="text-sm text-muted-foreground">{task.status.name}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{task.priority}</Badge>
                                    </div>
                                ))}
                                {(!project.tasks || project.tasks.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No tasks yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task Management',
    },
    {
        title: 'Projects',
        href: '/task-management/projects',
    },
    {
        title: 'Details',
    },
];

ProjectShow.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default ProjectShow;
