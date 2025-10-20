import { InputHTMLAttributes, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

type DebounceInputProps = {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

export const DebounceInput = ({
                                  value: initialValue,
                                  onChange,
                                  debounce = 500,
                                  ...props
                              }: DebounceInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default DebounceInput
