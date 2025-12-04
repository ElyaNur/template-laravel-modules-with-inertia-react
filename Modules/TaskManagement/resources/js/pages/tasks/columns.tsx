'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TaskData, TaskPriority } from '@/types';

const priorityLabels: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

export const columns: ColumnDef<TaskData>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="TASK" />,
        cell: ({ row }) => {
            const task = row.original;
            return (
                <div className="max-w-[300px]">
                    <Link href={`/task-management/all-tasks/${task.id}`} className="font-medium hover:underline">
                        {task.title}
                    </Link>
                    {task.description && (
                        <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="STATUS" />,
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant="outline"
                    style={{
                        borderColor: status.color,
                        color: status.color,
                    }}
                >
                    {status.name}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.original.status.id);
        },
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => <DataTableColumnHeader column={column} title="PRIORITY" />,
        cell: ({ row }) => {
            const priority = row.original.priority;
            const color = row.original.priority_color;
            return (
                <Badge
                    variant="outline"
                    style={{
                        borderColor: color,
                        color: color,
                    }}
                >
                    {priorityLabels[priority]}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'assigned_users',
        header: 'ASSIGNED',
        cell: ({ row }) => {
            const users = row.original.assigned_users;
            const displayUsers = users.slice(0, 3);
            const extraCount = users.length - 3;

            return (
                <div className="flex -space-x-2">
                    {displayUsers.map((user) => (
                        <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="text-xs">
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                    {extraCount > 0 && (
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="text-xs">+{extraCount}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'deadline',
        header: ({ column }) => <DataTableColumnHeader column={column} title="DEADLINE" />,
        cell: ({ row }) => {
            const deadline = row.original.deadline;
            if (!deadline) return <span className="text-muted-foreground">No deadline</span>;

            const deadlineDate = new Date(deadline);
            const isOverdue = deadlineDate < new Date() && !row.original.completed_at;
            const timeLeft = formatDistanceToNow(deadlineDate, { addSuffix: true });

            return (
                <div className={isOverdue ? 'text-destructive font-medium' : ''}>
                    {timeLeft}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => {
            const task = row.original;

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
                            <Link href={`/task-management/all-tasks/${task.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/task-management/all-tasks/${task.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this task?')) {
                                    // Handle delete
                                }
                            }}
                        >
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
