import AgamaController from '@/actions/Modules/Master/Http/Controllers/AgamaController';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import Cru from './cru';

const Edit = () => {
    const agama = usePage<SharedData>().props.agama;

    return (
        <>
            <Head title="Agama Edit" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Edit Agama</CardTitle>
                        <CardDescription>Melakukan edit data agama</CardDescription>
                    </div>
                </CardHeader>
                <Cru agama={agama} />
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
    },
    {
        title: 'Agama',
        href: AgamaController.index().url,
    },
    {
        title: 'Edit',
    },
];

Edit.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Edit;
