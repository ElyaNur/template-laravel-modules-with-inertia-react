'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserData } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ActionColumn from '@/components/data-table/data-table-action-column';

export const columns: ColumnDef<UserData>[] = [
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
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="NAMA" />,
    },
    {
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title="USERNAME" />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="EMAIL" />,
    },
    {
        accessorKey: 'roles',
        header: 'ROLES',
        cell: ({ row }) => {
            const user = row.original;

            if (!user.roles) return '-';

            const isSeeMoreRoles = user.roles && user.roles.length > 2;

            return (
                <div className="flex gap-3">
                    {user.roles.slice(0, 2).map((roles, index: number) => (
                        <Badge key={index} className="max-w-32 ring-2 ring-primary ring-offset-2 ring-offset-background">
                            <p className="truncate">{roles.name}</p>
                        </Badge>
                    ))}
                    {isSeeMoreRoles && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <span className="cursor-pointer">
                                    <Badge className="ring-2 ring-primary ring-offset-2 ring-offset-background">See more...</Badge>
                                </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        All permissions available for user <b>{user.name}</b>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    {user.roles.map((roles, index: number) => (
                                        <Badge key={index} className="ring-2 ring-primary ring-offset-2 ring-offset-background">
                                            {roles.name}
                                        </Badge>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => <ActionColumn route="settings.user" id={row.original.id} isTrashed={row.original.deleted_at !== null} />,
        enableSorting: false,
        enableHiding: false,
    },
];
