import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, TaskData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import TaskForm from '../../components/task-form';

const EditTask = () => {
    const { task, statuses, users } = usePage<SharedData & {
        task: TaskData;
        statuses: Array<{ id: number; name: string; color: string }>;
        users: Array<{ id: number; name: string; email: string }>;
    }>().props;

    return (
        <>
            <Head title="Edit Task" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <TaskForm task={task} statuses={statuses} users={users} type="edit" />
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
        title: 'Edit',
    },
];

EditTask.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default EditTask;
