import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import ProjectForm from './components/project-form';

const ProjectCreate = () => {
    return (
        <>
            <Head title="Create Project" />
            <Card>
                <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                    <CardDescription>
                        Set up a new project to organize your tasks and workflows
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectForm type="create" />
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
        title: 'Create',
    },
];

ProjectCreate.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default ProjectCreate;
