import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import { toast as toastr } from 'sonner';
import { QuickTaskModal } from '@/components/quick-task-modal';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const [quickTaskOpen, setQuickTaskOpen] = useState(false);

    // Ctrl+K or Cmd+K to open quick task modal
    useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        metaKey: true,
        callback: () => setQuickTaskOpen(true),
    });

    router.on('success', (event) => {
        const toast = event.detail.page.props.toast as { success: boolean; message: string };

        if (!toast) return;
        const title = toast.success ? 'Berhasil!' : 'Gagal!';

        if (toast.success) {
            toastr.success(title, { description: toast.message });
        } else {
            toastr.error(toast.message, { description: toast.message });
        }
    });

    router.on('error', (event) => {
        const error = event.detail;

        toastr.error('Gagal menambahkan  data', {
            description: (
                <ul className="ml-4 list-disc">
                    {Object.values(error.errors).map((err, key) => (
                        <li key={err}>
                            <b>{Object.keys(error.errors)[key].replace('_', ' ')}</b> {err}
                        </li>
                    ))}
                </ul>
            ),
        });
    });

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
            <QuickTaskModal open={quickTaskOpen} onOpenChange={setQuickTaskOpen} />
        </>
    );
};
