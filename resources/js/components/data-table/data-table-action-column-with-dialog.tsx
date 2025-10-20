import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ArchiveRestore, Eye, Loader2, SquarePen, TriangleAlert } from 'lucide-react'
import DeleteButton from '@/components/data-table/data-table-delete-button'
import { router } from '@inertiajs/react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { MenuData } from '@/types'

function ActionColumnWithDialog({
    route: routeName,
    id,
    menu,
    isTrashed,
    dialog,
}: {
    route: string
    id: number
    menu: MenuData
    isTrashed: boolean
    dialog: (type: 'create' | 'edit' | 'show', openDialog: boolean, setOpenDialog: Dispatch<SetStateAction<boolean>>, menu: MenuData) => ReactNode
}) {
    const [dialogRestore, setDialogRestore] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [dialogRu, setDialogRu] = useState(false)
    const [typeDialogRu, setTypeDialogRu] = useState('')

    const handleOpenDialogRu = (type: 'create' | 'edit' | 'show') => {
        setTypeDialogRu(type)
        setDialogRu(true)
    }

    const handleRestoreAction = () => {
        router.patch(
            route(`${routeName}.restore`, id),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        )
    }

    return (
        <div className='flex items-center gap-3'>
            <TooltipProvider delayDuration={0}>
                {!isTrashed ? (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size='icon' variant='outline' onClick={() => handleOpenDialogRu('show')}>
                                    <Eye className='w-4 h-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className='bg-background text-foreground'>
                                <p>Lihat</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size='icon' onClick={() => handleOpenDialogRu('edit')}>
                                    <SquarePen className='w-4 h-4' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size='icon'
                                asChild
                                className='bg-amber-500 hover:bg-amber-700 dark:bg-amber-300 dark:hover:bg-amber-500'
                                onClick={() => setDialogRestore(true)}
                            >
                                <button>
                                    <ArchiveRestore className='w-4 h-4' />
                                </button>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className='bg-amber-500'>
                            <p>Restore</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </TooltipProvider>

            <Dialog open={dialogRestore} onOpenChange={setDialogRestore}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-center'>Apakah anda yakin ingin merestore data ini?</DialogTitle>
                        <DialogDescription className='text-center'>Ini akan mengembalikan data yang sudah dihapus</DialogDescription>
                    </DialogHeader>
                    <TriangleAlert className='h-16 text-amber-500 flex justify-center w-full' />
                    <DialogFooter className='sm:justify-center'>
                        <DialogClose asChild>
                            <Button type='button' variant='secondary'>
                                Close
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type='button' className='bg-amber-500 hover:bg-amber-600' onClick={handleRestoreAction}>
                                {processing ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please wait...
                                    </>
                                ) : (
                                    'Restore'
                                )}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {dialog(typeDialogRu as 'create' | 'edit' | 'show', dialogRu, setDialogRu, menu)}

            <DeleteButton route={route(`${routeName}.${isTrashed ? 'force-destroy' : 'destroy'}`, id)} isTrashed={isTrashed} />
        </div>
    )
}

export default ActionColumnWithDialog
