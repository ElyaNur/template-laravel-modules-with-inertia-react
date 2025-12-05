import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectData, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import ProjectForm from './components/project-form';

const ProjectEdit = () => {
    const { project } = usePage<SharedData & { project: ProjectData }>().props;
    return (
        <>
            <Head title={`Edit ${project.name}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Project</CardTitle>
                    <CardDescription>
                        Update your project details and settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectForm type="edit" project={project} />
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
        href: '/task-management/projects',
    },
    {
        title: 'Edit',
    },
];

ProjectEdit.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default ProjectEdit;
