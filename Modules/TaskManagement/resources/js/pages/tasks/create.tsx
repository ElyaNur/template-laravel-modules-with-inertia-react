import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import TaskForm from '../../components/task-form';

type PageProps = {
    statuses: Array<{ id: number; name: string; color: string }>;
    users: Array<{ id: number; name: string; email: string }>;
};

const CreateTask = () => {
    const { statuses, users } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Create Task" />
            <Card>
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <TaskForm statuses={statuses} users={users} type="create" />
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
        title: 'Create',
    },
];

CreateTask.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default CreateTask;
