import { useDataTable } from '@/components/data-table/hooks/use-data-table';
import { PaginatedResponse } from '@/types';

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

export const useStatusTable = ({ data }: { data: PaginatedResponse<TaskStatusData> }) => {
    const { sorting, setSorting, globalFilter, setGlobalFilter, rowSelection, setRowSelection, columnVisibility, setColumnVisibility } =
        useDataTable();

    return {
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        data,
        isLoading: false,
    };
};
