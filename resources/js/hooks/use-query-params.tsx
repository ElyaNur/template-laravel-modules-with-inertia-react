import { useMemo } from 'react'

export const useQueryParams = () => useMemo(() => Object.fromEntries(new URLSearchParams(window.location.search)), [])
