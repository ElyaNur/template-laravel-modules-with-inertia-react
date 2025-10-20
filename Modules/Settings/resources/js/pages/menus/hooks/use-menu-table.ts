import { useDataTable } from '@/components/data-table/hooks/use-data-table';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';
import { MenuData, PaginatedResponse, SharedData } from '@/types';
import { destroyBulk } from '@/actions/Modules/Settings/Http/Controllers/MenuController';

export const useMenuTable = ({ data }: { data: PaginatedResponse<MenuData> }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPendingDeleteBulk, setIsPendingDeleteBulk] = useState<boolean>(false);
    const [withTrashed, setWithTrashed] = useState<'without-trashed' | 'with-trashed' | 'only-trashed'>('without-trashed');
    const isFirstRender = useRef(true);

    const query = useQueryParams();

    const { ziggy } = usePage<SharedData>().props;

    const currentPath = useMemo(() => {
        if (ziggy?.location) {
            try {
                return new URL(ziggy.location).pathname || '/';
            } catch {
                if (typeof window !== 'undefined') {
                    return window.location.pathname;
                }
            }
        }

        if (typeof window !== 'undefined') {
            return window.location.pathname;
        }

        return '/';
    }, [ziggy?.location]);

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
            currentPath,
            {
                ...updatedQuery,
                filter: globalFilter,
                sort,
                withTrashed,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    }, [globalFilter, sorting, withTrashed, currentPath, query]);

    useEffect(() => {
        if (query.withTrashed) {
            setWithTrashed(query.withTrashed as 'without-trashed' | 'with-trashed' | 'only-trashed');
        }
    }, [query]);

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

        router.delete(destroyBulk.url({ query: { ids: ids as unknown as string[] } }), {
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
        setWithTrashed,
        withTrashed,
    };
};
