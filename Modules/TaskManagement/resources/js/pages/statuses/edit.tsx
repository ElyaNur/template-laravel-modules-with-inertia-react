import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import StatusForm from './components/status-form';

type TaskStatusData = {
    id: number;
    name: string;
    slug: string;
    color: string;
    sort: number;
    is_default: boolean;
    is_completed: boolean;
};

const EditStatus = () => {
    const { status } = usePage<SharedData & { status: TaskStatusData }>().props;

    return (
        <>
            <Head title={`Edit ${status.name}`} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Task Status</CardTitle>
                    <Button variant="outline" asChild>
                        <Link href="/task-management/task-statuses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <StatusForm type="edit" status={status} />
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
        title: 'Statuses',
        href: '/task-management/task-statuses',
    },
    {
        title: 'Edit',
    },
];

EditStatus.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default EditStatus;

