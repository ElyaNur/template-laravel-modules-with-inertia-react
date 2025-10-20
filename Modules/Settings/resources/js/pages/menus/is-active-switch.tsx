import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import {update} from '@/actions/Modules/Settings/Http/Controllers/MenuController';

const IsActiveSwitch = ({ is_active, id, redirectBack = false }: { is_active: boolean; id: number; redirectBack?: boolean }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [switchState, setSwitchState] = useState(is_active)

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!errorMessage) {
            return
        }

        if (typeof window === 'undefined') {
            return
        }

        const timeout = window.setTimeout(() => setErrorMessage(null), 4000)

        return () => window.clearTimeout(timeout)
    }, [errorMessage])

    const handleSwitchChange = (state: boolean) => {
        const previousState = switchState
        setSwitchState(state)
        setErrorMessage(null)

        router.put(
            update.url({ menu: id }, { query: { redirect_back: redirectBack } }),
            { is_active: state },
            {
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onError: () => {
                    setSwitchState(previousState)
                    setErrorMessage('Gagal memperbarui status menu.')
                },
                onSuccess: () => setErrorMessage(null),
                onFinish: () => setIsLoading(false),
            },
        )
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Switch checked={switchState} onCheckedChange={state => handleSwitchChange(state)} disabled={isLoading} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{switchState ? 'Aktif' : 'Tidak Aktif'}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {errorMessage && <span className='text-xs text-destructive'>{errorMessage}</span>}
        </div>
    )
}

export default IsActiveSwitch

