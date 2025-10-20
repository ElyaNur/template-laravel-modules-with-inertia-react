import RoleController from '@/actions/Modules/Settings/Http/Controllers/RoleController';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import Cru from './cru';

const Edit = () => {
    const role = usePage<SharedData>().props.role;

    return (
        <>
            <Head title="Role Edit" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Edit Role</CardTitle>
                        <CardDescription>Melakukan edit data role</CardDescription>
                    </div>
                </CardHeader>
                <Cru role={role} />
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
        href: RoleController.index().url,
    },
    {
        title: 'Edit',
    },
];

Edit.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Edit;
