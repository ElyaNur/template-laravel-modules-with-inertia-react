'use client';

import ActionColumn from '@/components/data-table/data-table-action-column';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { RoleData } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<RoleData>[] = [
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
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => <ActionColumn route="settings.role" id={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
    },
];
