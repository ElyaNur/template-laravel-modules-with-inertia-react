'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UseTableReturnType } from '@/types'
import DebounceInput from '@/components/debounce-input'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { FolderOpen, Loader, Trash, Trash2 } from 'lucide-react'
import Pagination from '@/components/pagination'
import { Deferred } from '@inertiajs/react'
import DeleteButtonWithAlert from '@/components/delete-button-with-alert';

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[]
    hooks: UseTableReturnType<TData>
    deferred?: string
}

interface Identifier {
    id: number
    deleted_at?: string | null
}

export function DataTable<TData extends Identifier>({ columns, hooks, deferred = undefined }: DataTableProps<TData>) {
    if (!deferred) {
        return <TableData columns={columns} hooks={hooks} deferred={deferred} />
    }

    return (
        <Deferred fallback={<div>Loading...</div>} data={deferred}>
            <TableData columns={columns} hooks={hooks} deferred={deferred} />
        </Deferred>
    )
}

function TableData<TData extends Identifier>({ columns, hooks, deferred }: DataTableProps<TData>) {
    const {
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        data: query,
        deleteBulk,
        isPendingDeleteBulk,
        setWithTrashed,
        withTrashed,
        isLoading,
    } = hooks

    const table = useReactTable({
        data: query?.data || [],
        columns,
        getRowId: row => String(row.id),
        state: {
            sorting,
            globalFilter,
            rowSelection,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        enableGlobalFilter: true,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    const handleDeleteBulk = () => {
        const ids = Object.keys(rowSelection as Record<string, boolean>).map(Number)
        deleteBulk(ids)
    }

    return (
        <div className='flex flex-col gap-3 w-full'>
            <div className='flex justify-between'>
                <div className='flex justify-between'>
                    <div>
                        {Object.keys(rowSelection).length > 0 && (
                            <DeleteButtonWithAlert isLoading={isPendingDeleteBulk} onClick={handleDeleteBulk}>
                                <Button variant='link' size='sm' className='text-foreground hover:text-destructive flex gap-1'>
                                    <Trash2 className='w-4 h-4' />
                                    Hapus yang dipilih
                                </Button>
                            </DeleteButtonWithAlert>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='ml-auto'>
                                    Tampilan Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                {table
                                    .getAllColumns()
                                    .filter(column => column.getCanHide())
                                    .map(column => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className='capitalize'
                                                checked={column.getIsVisible()}
                                                onCheckedChange={value => column.toggleVisibility(value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {withTrashed && setWithTrashed && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={
                                            withTrashed === 'without-trashed'
                                                ? 'outline'
                                                : withTrashed === 'with-trashed'
                                                  ? 'default'
                                                  : withTrashed === 'only-trashed'
                                                    ? 'destructive'
                                                    : undefined
                                        }
                                    >
                                        {withTrashed === 'without-trashed' && (
                                            <>
                                                <FolderOpen /> Without Trashed
                                            </>
                                        )}
                                        {withTrashed === 'with-trashed' && (
                                            <>
                                                <Trash /> With Trashed
                                            </>
                                        )}
                                        {withTrashed === 'only-trashed' && (
                                            <>
                                                <Trash2 /> With Trashed
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56'>
                                    <DropdownMenuCheckboxItem checked={withTrashed === 'without-trashed'} onClick={() => setWithTrashed('without-trashed')}>
                                        Without Trashed
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={withTrashed === 'with-trashed'} onClick={() => setWithTrashed('with-trashed')}>
                                        With Trashed
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={withTrashed === 'only-trashed'} onClick={() => setWithTrashed('only-trashed')}>
                                        Only Trashed
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <DebounceInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder='Search all columns...'
                            className='w-52'
                        />
                        {isLoading && <Loader className='w-4 h-4 animate-spin' />}
                    </div>
                </div>
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={
                                        row.original.deleted_at
                                            ? 'data-[state=selected]:bg-destructive/40 data-[state=selected]:text-foreground text-destructive-foreground hover:bg-destructive/90 bg-destructive'
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination data={query} only={deferred} />
        </div>
    )
}
