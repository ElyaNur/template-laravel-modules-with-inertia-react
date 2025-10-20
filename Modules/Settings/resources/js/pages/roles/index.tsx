import RoleController from '@/actions/Modules/Settings/Http/Controllers/RoleController';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RoleData, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { columns } from './columns';
import { useRoleTable } from './hooks/use-role-table';

const Roles = () => {
    const roles = usePage<SharedData>().props.roles;
    const hooks = useRoleTable({ data: roles });

    return (
        <>
            <Head title="Role" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Role</CardTitle>
                        <CardDescription>Membuat Role dan mengatur baru</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href={RoleController.create().url}>Tambah Role</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable<RoleData> columns={columns} hooks={hooks} />
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
        title: 'Role',
    },
];

Roles.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Roles;
