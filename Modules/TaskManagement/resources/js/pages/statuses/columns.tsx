'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { MoreHorizontal, Pencil, Trash2, GripVertical } from 'lucide-react';

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

export const columns: ColumnDef<TaskStatusData>[] = [
    {
        accessorKey: 'sort',
        header: '',
        cell: () => {
            return (
                <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="STATUS NAME" />,
        cell: ({ row }) => {
            const status = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="font-medium">{status.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'tasks_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title="TASKS" />,
        cell: ({ row }) => {
            return <span className="text-muted-foreground">{row.original.tasks_count}</span>;
        },
    },
    {
        accessorKey: 'is_default',
        header: 'DEFAULT',
        cell: ({ row }) => {
            if (!row.original.is_default) return null;
            return (
                <Badge variant="secondary" className="text-xs">
                    Default
                </Badge>
            );
        },
    },
    {
        accessorKey: 'is_completed',
        header: 'MARKS COMPLETE',
        cell: ({ row }) => {
            if (!row.original.is_completed) return null;
            return (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                    Yes
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => {
            const status = row.original;

            const handleDelete = () => {
                if (confirm(`Are you sure you want to delete "${status.name}"?`)) {
                    router.delete(`/task-management/task-statuses/${status.id}`, {
                        preserveScroll: true,
                    });
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/task-management/task-statuses/${status.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

