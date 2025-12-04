import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { List, Plus } from 'lucide-react';
import { ReactNode } from 'react';
import KanbanBoard from '../../components/kanban/kanban-board'

type TaskData = {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    priority_color: string;
    deadline?: string;
    is_overdue: boolean;
    assigned_users: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    sort: number;
};

type StatusData = {
    id: number;
    name: string;
    slug: string;
    color: string;
    is_completed: boolean;
    tasks: TaskData[];
};

type PageProps = {
    kanbanData: StatusData[];
    users: Array<{ id: number; name: string; email: string }>;
    filters: {
        assigned_to?: number;
        priority?: string;
    };
};

const KanbanView = () => {
    const { kanbanData, users, filters } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Kanban Board" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Kanban Board</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/task-management/all-tasks">
                                <List className="mr-2 h-4 w-4" />
                                List View
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/task-management/all-tasks/create">
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
