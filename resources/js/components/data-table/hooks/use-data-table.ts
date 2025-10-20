import { useState } from 'react'
import { RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table'

export const useDataTable = (sortBy = 'id') => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: sortBy,
            desc: true,
        },
    ])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    return {
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
    }
}
