import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { NotificationBell } from '@/components/notification-bell';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { QuickTaskModal } from '@/components/quick-task-modal';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [quickTaskOpen, setQuickTaskOpen] = useState(false);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2 flex-1">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => setQuickTaskOpen(true)}
                    className="gap-1"
                >
                    <Plus className="h-4 w-4" />
                    New Task
                </Button>
                <NotificationBell />
            </header>
            <QuickTaskModal open={quickTaskOpen} onOpenChange={setQuickTaskOpen} />
        </>
    );
}
