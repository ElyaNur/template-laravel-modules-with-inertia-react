'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MenuData } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import DialogCruSubMenu from './dialog-cru-sub-menu';
import IsActiveSwitch from '../../is-active-switch';
import ActionColumnWithDialog
    from '@/components/data-table/data-table-action-column-with-dialog';

const renderDialog = (type: 'create' | 'edit' | 'show', open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, menu: MenuData) => (
    <DialogCruSubMenu type={type} open={open} setOpen={setOpen} menu={menu} />
)

export const columns: ColumnDef<MenuData>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'nama',
        header: ({ column }) => <DataTableColumnHeader column={column} title='NAMA' />,
    },
    {
        accessorKey: 'keterangan',
        header: ({ column }) => <DataTableColumnHeader column={column} title='KETERANGAN' />,
    },
    {
        accessorKey: 'sort',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SORT' />,
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title='AKTIF' />,
        cell: ({ row }) => <IsActiveSwitch is_active={row.original.is_active} id={row.original.id} redirectBack={true} />,
    },
    {
        accessorKey: 'permissions_or_models',
        header: 'Permissions',
        cell: ({ row }) => {
            const menu = row.original
            const permissions = menu.permissions_or_models ?? []
            const isSeeMorePermissions = permissions.length > 2

            return (
                <div className='flex gap-3'>
                    {permissions.slice(0, 2).map((permission, index) => {
                        const key = permission.value ?? permission.label ?? 'permission-' + index

                        return (
                            <Badge key={key} className='ring-2 ring-primary ring-offset-2 ring-offset-background max-w-32'>
                                <p className='truncate'>{permission.value}</p>
                            </Badge>
                        )
                    })}
                    {isSeeMorePermissions && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <span className='cursor-pointer'>
                                    <Badge className='ring-2 ring-primary ring-offset-2 ring-offset-background'>See more...</Badge>
                                </span>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-xl'>
                                <DialogHeader>
                                    <DialogTitle>
                                        All permissions available for menu <b>{menu.nama}</b>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className='grid grid-cols-2 gap-4 py-4'>
                                    {permissions.map((permission, index) => {
                                        const key = permission.value ?? permission.label ?? 'permission-' + index

                                        return (
                                            <Badge key={key} className='ring-2 ring-primary ring-offset-2 ring-offset-background'>
                                                {permission.value}
                                            </Badge>
                                        )
                                    })}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type='button' variant='secondary'>
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => (
            <ActionColumnWithDialog
                route='settings.menu'
                id={row.original.id}
                isTrashed={row.original.deleted_at !== null}
                dialog={renderDialog}
                menu={row.original}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
]
