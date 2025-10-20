import DeleteButtonWithAlert from '@/components/delete-button-with-alert'
import { Trash, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function DeleteButton({ route, isTrashed }: { route: string; isTrashed: boolean }) {
    const [processing, setProcessing] = useState(false)

    const handleDeleteAction = () => {
        router.delete(route, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <DeleteButtonWithAlert isLoading={processing} onClick={handleDeleteAction} isTrashed={isTrashed}>
            <Button variant='destructive' size='icon'>
                {isTrashed ? <Trash2 className='w-4 h-4' /> : <Trash className='w-4 h-4' />}
            </Button>
        </DeleteButtonWithAlert>
    )
}
