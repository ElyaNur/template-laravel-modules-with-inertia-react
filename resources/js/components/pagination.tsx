import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Link, PaginatedResponse } from '@/types'
import { useMemo } from 'react'
import { useQueryParams } from '@/hooks/use-query-params'

export default function Pagination<T>({ data, only }: { data: PaginatedResponse<T>; only?: string }) {
    const links = data?.links
    const query = useQueryParams()

    const urlWithSearchParam = (url: string | null) => {
        if (url && Object.keys(query).length > 0) {
            const newUrl = new URL(url)

            for (const key in query) {
                newUrl.searchParams.append(key, query[key])
            }

            return newUrl
        }
        return url
    }

    const getPaginationText = useMemo(() => {
        if (!data) return ''
        const start = (data.current_page - 1) * data.per_page + 1
        const end = Math.min(data.current_page * data.per_page, data.total)
        return `Showing ${start} to ${end} of ${data.total} entries`
    }, [data])

    if (!data) return null

    return (
        <div className='flex justify-between items-center'>
            {links?.length > 1 && (
                <div className='flex items-center space-x-2'>
                    {links.map((link: Link, key: number) => {
                        const cleanLabel = link.label.replace(/&raquo;|&laquo;/g, '')
                        const buttonVariant = link.active ? 'default' : 'outline'
                        const url = urlWithSearchParam(link.url)

                        return link.url === null ? (
                            <Button key={key} variant='outline' type='button' size='sm'>
                                {cleanLabel}
                            </Button>
                        ) : (
                            <Button
                                variant={buttonVariant}
                                key={key}
                                size='sm'
                                onClick={() =>
                                    router.get(
                                        url ?? '#',
                                        {},
                                        {
                                            preserveState: true,
                                            preserveUrl: true,
                                            only: only ? [only] : undefined,
                                        },
                                    )
                                }
                                type='button'
                            >
                                {cleanLabel}
                            </Button>
                        )
                    })}
                </div>
            )}

            <p className='text-sm'>{getPaginationText}</p>
        </div>
    )
}
