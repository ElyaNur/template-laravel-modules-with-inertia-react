import { useEffect } from 'react';

interface UseKeyboardShortcutOptions {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    callback: () => void;
    enabled?: boolean;
}

export function useKeyboardShortcut({
    key,
    ctrlKey = false,
    metaKey = false,
    callback,
    enabled = true,
}: UseKeyboardShortcutOptions) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = ctrlKey || metaKey;
            const hasModifier = (ctrlKey && event.ctrlKey) || (metaKey && event.metaKey);

            if (event.key.toLowerCase() === key.toLowerCase()) {
                if (isCtrlOrCmd) {
                    if (hasModifier) {
                        event.preventDefault();
                        callback();
                    }
                } else {
                    event.preventDefault();
                    callback();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [key, ctrlKey, metaKey, callback, enabled]);
}
