import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AgamaController from '../../../../../../resources/js/actions/Modules/Master/Http/Controllers/AgamaController';
import Cru from './cru';

const Create = () => {
    return (
        <>
            <Head title="Create Agama" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Create Agama</CardTitle>
                        <CardDescription>Membuat Agama</CardDescription>
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
        title: 'Agama',
        href: AgamaController.index().url,
    },
    {
        title: 'Create',
    },
];

Create.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Create;
