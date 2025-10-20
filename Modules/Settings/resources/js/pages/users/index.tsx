import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, UserData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import UserController from '@/actions/Modules/Settings/Http/Controllers/UserController';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserTable } from './hooks/use-user-table';
import { columns } from './columns';

const Users = () => {
    const { users } = usePage<SharedData>().props;
    const hooks = useUserTable({ data: users });

    return (
        <>
            <Head title="User" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>User</CardTitle>
                        <CardDescription>Page untuk mengatur user pada aplikasi</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href={UserController.create()}>Tambah User</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable<UserData> columns={columns} hooks={hooks} />
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
        title: 'User',
    },
];

Users.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Users;
