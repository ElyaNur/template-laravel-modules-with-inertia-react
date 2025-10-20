import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePage } from '@inertiajs/react'
import { MenuData } from '@/types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useMenuTable } from '../../hooks/use-menu-table';
import { SharedData } from '@/types';
import DialogCruSubMenu from './dialog-cru-sub-menu';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';

const SubMenu = () => {
    const { menu, subMenus } = usePage<SharedData>().props
    const hooks = useMenuTable({ data: subMenus })
    const [openDialog, setOpenDialog] = useState(false)

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between'>
                    <div>
                        <CardTitle>Sub menu</CardTitle>
                        <CardDescription>
                            Menambahkan sub menu pada menu{' '}
                            <i>
                                <b>{menu.nama}</b>
                            </i>
                        </CardDescription>
                    </div>

                    <Button type='button' onClick={() => setOpenDialog(true)}>
                        Tambah Sub Menu
                    </Button>
                    <DialogCruSubMenu type='create' open={openDialog} setOpen={setOpenDialog} />
                </div>
            </CardHeader>
            <CardContent className='space-y-2'>
                <DataTable<MenuData> columns={columns} hooks={hooks} />
            </CardContent>
        </Card>
    )
}

export default SubMenu
