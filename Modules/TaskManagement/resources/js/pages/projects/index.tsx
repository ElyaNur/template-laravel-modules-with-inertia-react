import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectData, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Archive, CheckCircle2, Clock } from 'lucide-react';
import { ReactNode, useState } from 'react';

const ProjectIndex = () => {
    const { projects } = usePage<SharedData & { projects: ProjectData[] }>().props;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeProjects = filteredProjects.filter(p => !p.is_archived);
    const archivedProjects = filteredProjects.filter(p => p.is_archived);

    const handleArchiveToggle = (project: ProjectData) => {
        router.patch(
            `/task-management/projects/${project.id}/archive`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title="Projects" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>
                            Organize your tasks and workflows by project
                        </CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/task-management/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* Active Projects */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Active Projects</h3>
                        {activeProjects.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No active projects found.</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activeProjects.map((project) => (
                                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: project.color }}
                                                    />
                                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                                </div>
                                            </div>
                                            {project.description && (
                                                <CardDescription className="line-clamp-2">
                                                    {project.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>{project.tasks_count || 0} tasks</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{project.task_statuses_count || 0} statuses</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild className="flex-1">
                                                    <Link href={`/task-management/projects/${project.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild className="flex-1">
                                                    <Link href={`/task-management/projects/${project.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleArchiveToggle(project)}
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Archived Projects */}
                    {archivedProjects.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-muted-foreground">Archived Projects</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {archivedProjects.map((project) => (
                                    <Card key={project.id} className="opacity-60">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: project.color }}
                                                    />
                                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                                </div>
                                                <Badge variant="secondary">Archived</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleArchiveToggle(project)}
                                                >
                                                    Restore
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task Management',
    },
    {
        title: 'Projects',
    },
];

ProjectIndex.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default ProjectIndex;
