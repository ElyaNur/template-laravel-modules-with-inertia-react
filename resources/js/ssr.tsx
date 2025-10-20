import { Toaster } from '@/components/ui/sonner';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { resolveInertiaPage } from './page-resolver';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => resolveInertiaPage(name),
        setup: ({ App, props }) => {
            return (
                <>
                    <App {...props} />
                    <Toaster position="top-center" />
                </>
            );
        },
    }),
);
