import UserController from '@/actions/Modules/Settings/Http/Controllers/UserController';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import Cru from './cru';

const Edit = () => {
    const user = usePage<SharedData>().props.user;

    return (
        <>
            <Head title="User Edit" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription>Melakukan edit data user</CardDescription>
                    </div>
                </CardHeader>
                <Cru user={user} />
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
        href: UserController.index().url,
    },
    {
        title: 'Edit',
    },
];

Edit.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Edit;
