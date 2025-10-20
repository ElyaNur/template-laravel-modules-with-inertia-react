import React, { type ReactNode } from 'react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cru from './cru';
import MenuController from '@/actions/Modules/Settings/Http/Controllers/MenuController';

const Create = () => {
    return (
        <>
            <Head title='Menu Create' />
            <Card>
                <CardHeader className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <CardTitle>Tambah Menu</CardTitle>
                        <CardDescription>Tambah data menu</CardDescription>
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
        title: 'Menu',
        href: MenuController.index().url
    },
    {
        title: 'Create',
    }
];


Create.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs}/>;


export default Create;
