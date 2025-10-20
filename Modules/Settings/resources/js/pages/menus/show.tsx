import React, { type ReactNode } from 'react';
import { BreadcrumbItem, SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cru from './cru';
import MenuController from '@/actions/Modules/Settings/Http/Controllers/MenuController';

const Show = () => {
    const menu = usePage<SharedData>().props.menu

    return (
        <>
            <Head title='Menu Show' />
            <Card>
                <CardHeader className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <CardTitle>Lihat Menu</CardTitle>
                        <CardDescription>Melihat data menu</CardDescription>
                    </div>
                </CardHeader>
                <Cru menu={menu} />
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
        href: MenuController.index().url
    },
    {
        title: 'Show',
    }
];


Show.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs}/>;


export default Show;
