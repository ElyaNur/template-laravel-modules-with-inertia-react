import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TaskData, TaskStatusData, TaskFilters, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { KanbanSquare, Plus } from 'lucide-react';
import { ReactNode } from 'react';
import { columns } from './columns';
import { useTaskTable } from './hooks/use-task-table';

const TaskIndex = () => {
    const { tasks } = usePage<SharedData>().props;
    const hooks = useTaskTable({ data: tasks });

    return (
        <>
            <Head title="Tasks" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Tasks</CardTitle>
                        <CardDescription>Manage your tasks and track progress</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/task-management/kanban-board">
                                <KanbanSquare className="mr-2 h-4 w-4" />
                                Kanban Board
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
                    <DataTable<TaskData> columns={columns} hooks={hooks} />
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
    },
];

TaskIndex.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default TaskIndex;
