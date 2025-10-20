import UserController from '@/actions/Modules/Settings/Http/Controllers/UserController';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import Cru from './cru';

const Create = () => {
    return (
        <>
            <Head title="Create User" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Create User</CardTitle>
                        <CardDescription>Membuat User</CardDescription>
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
        title: 'User',
        href: UserController.index().url,
    },
    {
        title: 'Create',
    },
];

Create.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Create;
