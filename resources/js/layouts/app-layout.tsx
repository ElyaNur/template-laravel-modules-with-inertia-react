import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { toast as toastr } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
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
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
