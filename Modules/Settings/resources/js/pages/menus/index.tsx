import MenuController from '@/actions/Modules/Settings/Http/Controllers/MenuController';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MenuData, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { columns } from './columns';
import { useMenuTable } from './hooks/use-menu-table';

const Menus = () => {
    const { menus, toast } = usePage<SharedData>().props;
    const hooks = useMenuTable({ data: menus });

    return (
        <>
            <Head title="Menu" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Menu</CardTitle>
                        <CardDescription>Membuat menu baru</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href={MenuController.create().url}>Tambah Menu</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable<MenuData> columns={columns} hooks={hooks} />
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
    },
    {
        title: 'Menu',
    },
];

Menus.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Menus;
