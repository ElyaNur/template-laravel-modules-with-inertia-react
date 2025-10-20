import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePage } from '@inertiajs/react'
import { Dispatch, SetStateAction } from 'react'
import { MenuData } from '@/types'
import Cru from './cru';
import { SharedData } from '@/types';

const DialogCruSubMenu = ({
    type,
    open,
    setOpen,
    menu: SubMenu,
}: {
    type: 'create' | 'edit' | 'show'
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    menu?: MenuData
}) => {
    const menu = usePage<SharedData>().props.menu

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Tambah Sub Menu</DialogTitle>
                    <DialogDescription>
                        Tambahkan Sub Menu pada menu{' '}
                        <i>
                            <b>{menu.nama}</b>
                        </i>
                    </DialogDescription>
                </DialogHeader>
                <Cru type={type} setOpenDialog={setOpen} menu={SubMenu} />
            </DialogContent>
        </Dialog>
    )
}

export default DialogCruSubMenu
