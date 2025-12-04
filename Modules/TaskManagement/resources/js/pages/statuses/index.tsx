import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableStatusRow } from './components/sortable-status-row';

type TaskStatusData = {
    id: number;
    name: string;
    slug: string;
    color: string;
    sort: number;
    is_default: boolean;
    is_completed: boolean;
    tasks_count: number;
};

const StatusIndex = () => {
    const { statuses: initialStatuses } = usePage<SharedData & { statuses: PaginatedResponse<TaskStatusData> }>().props;
    const [statuses, setStatuses] = useState(initialStatuses.data);
    const [searchQuery, setSearchQuery] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = statuses.findIndex((status) => status.id === active.id);
        const newIndex = statuses.findIndex((status) => status.id === over.id);

        const newStatuses = arrayMove(statuses, oldIndex, newIndex);

        // Update local state immediately for smooth UX
        setStatuses(newStatuses);

        // Prepare data for backend
        const reorderedStatuses = newStatuses.map((status, index) => ({
            id: status.id,
            sort: index,
        }));

        // Send to backend
        router.post(
            '/task-management/task-statuses/reorder',
            { statuses: reorderedStatuses },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    // Revert on error
                    setStatuses(initialStatuses.data);
                },
            }
        );
    };

    const filteredStatuses = statuses.filter((status) =>
        status.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Task Statuses" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Task Statuses</CardTitle>
                        <CardDescription>Manage Kanban board columns and task workflow</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/task-management/task-statuses/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Status
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Search statuses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />

                    <div className="rounded-md border">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>STATUS NAME</TableHead>
                                        <TableHead>TASKS</TableHead>
                                        <TableHead>DEFAULT</TableHead>
                                        <TableHead>MARKS COMPLETE</TableHead>
                                        <TableHead>ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <SortableContext items={filteredStatuses.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                                        {filteredStatuses.map((status) => (
                                            <SortableStatusRow key={status.id} status={status} />
                                        ))}
                                    </SortableContext>
                                </TableBody>
                            </Table>
                        </DndContext>
                    </div>
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
    },
];

StatusIndex.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default StatusIndex;
