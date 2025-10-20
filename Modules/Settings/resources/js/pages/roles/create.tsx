import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import Cru from './cru';
import RoleController from '@/actions/Modules/Settings/Http/Controllers/RoleController';

const Create = () => {
    return (
        <>
            <Head title="Create Role" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Create Role</CardTitle>
                        <CardDescription>Membuat Role</CardDescription>
                    </div>
                </CardHeader>
                <Cru />
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
        title: 'Create',
    },
];

Create.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Create;
