import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import StatusForm from './components/status-form';

const CreateStatus = () => {
    const { nextSort } = usePage<SharedData & { nextSort: number }>().props;

    return (
        <>
            <Head title="Create Task Status" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Create Task Status</CardTitle>
                    <Button variant="outline" asChild>
                        <Link href="/task-management/task-statuses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <StatusForm type="create" defaultSort={nextSort} />
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
        title: 'Create',
    },
];

CreateStatus.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default CreateStatus;

