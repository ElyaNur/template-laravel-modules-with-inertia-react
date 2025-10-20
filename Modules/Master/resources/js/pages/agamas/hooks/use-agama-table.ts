import { useDataTable } from '@/components/data-table/hooks/use-data-table';
import { useQueryParams } from '@/hooks/use-query-params';
import { AgamaData, PaginatedResponse } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

export const useAgamaTable = ({ data }: { data: PaginatedResponse<AgamaData> }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPendingDeleteBulk, setIsPendingDeleteBulk] = useState<boolean>(false);
    const isFirstRender = useRef(true);

    const query = useQueryParams();

    const { sorting, setSorting, globalFilter, setGlobalFilter, rowSelection, setRowSelection, columnVisibility, setColumnVisibility } =
        useDataTable();
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsLoading(true);

        const sort = getSortString(sorting);
        const updatedQuery = getUpdatedQuery(query, globalFilter, sort);

        router.get(
            route(route().current() || '', route().params),
            {
                ...updatedQuery,
                filter: globalFilter,
                sort,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    }, [globalFilter, sorting]);

    const getSortString = (sorting: { id: string; desc: boolean }[]) => {
        return sorting.map((sort) => `${sort.id}:${sort.desc ? 'desc' : 'asc'}`).join(',');
    };

    const getUpdatedQuery = (query: Record<string, string>, globalFilter: string, sort: string): Record<string, string> => {
        const updatedQuery = { ...query };

        if (globalFilter !== query.filter) {
            delete updatedQuery.filter;
        }

        if (sort !== query.sort) {
            delete updatedQuery.sort;
        }

        return updatedQuery;
    };

    const deleteBulk = (ids: number[]) => {
        setIsPendingDeleteBulk(true);

        router.delete(route('master.agama.destroy.bulk', { ids }), {
            preserveScroll: true,
            onStart: () => setIsPendingDeleteBulk(true),

            onFinish: () => setIsPendingDeleteBulk(false),
        });
    };

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
        isLoading,
        deleteBulk,
        isPendingDeleteBulk,
    };
};
