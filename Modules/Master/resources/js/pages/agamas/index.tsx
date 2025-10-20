import AgamaController from '@/actions/Modules/Master/Http/Controllers/AgamaController';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { AgamaData, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { columns } from './columns';
import { useAgamaTable } from './hooks/use-agama-table';

const Roles = () => {
    const agama = usePage<SharedData>().props.agamas;
    const hooks = useAgamaTable({ data: agama });

    return (
        <>
            <Head title="Agama" />
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Agama</CardTitle>
                        <CardDescription>Membuat dan mengatur agama baru</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href={AgamaController.create().url}>Tambah Agama</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable<AgamaData> columns={columns} hooks={hooks} />
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
        title: 'Agama',
    },
];

Roles.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default Roles;
