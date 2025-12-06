import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import KanbanCard from './kanban-card';
import { memo, useCallback, useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { KanbanStatusData, KanbanTaskData } from '@/types';

type KanbanColumnProps = {
    status: KanbanStatusData & { tasks: (KanbanTaskData & { formattedDeadline?: string | null })[] };
    isDraggingColumn?: boolean;
};

function KanbanColumn({ status, isDraggingColumn = false }: KanbanColumnProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Column sortable
    const {
        attributes: columnAttributes,
        listeners: columnListeners,
        setNodeRef: setColumnRef,
        transform: columnTransform,
        transition: columnTransition,
        isOver: isOverColumn,  // Track if hovering over column (for task drops on empty columns)
    } = useSortable({
        id: `column-${status.id}`,
        data: { type: 'column', status },
    });

    // Task droppable
    const { setNodeRef: setDropRef, isOver: isOverStatus } = useDroppable({
        id: status.id,
        data: { type: 'status' },
    });

    // Combine hover states - show feedback if hovering over either column or status droppable
    const isOver = isOverColumn || isOverStatus;

    // Merge refs
    const setRefs = useCallback((node: HTMLDivElement | null) => {
        setColumnRef(node);
        setDropRef(node);
    }, [setColumnRef, setDropRef]);

    const taskIds = status.tasks.map((task) => task.id);

    // Handle delete
    const handleDelete = useCallback(() => {
        router.delete(`/task-management/task-statuses/${status.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowDeleteDialog(false),
        });
    }, [status.id]);

    // Column drag style
    const columnStyle = {
        transform: CSS.Transform.toString(columnTransform),
        transition: columnTransition,
        opacity: isDraggingColumn ? 0.5 : 1,
    };

    return (
        <>
            <div ref={setRefs} style={columnStyle} className="flex flex-col w-80 flex-shrink-0 h-full">
                {/* Column Header - Draggable with Grip Icon */}
                <div
                    {...columnAttributes}
                    {...columnListeners}
                    className="mb-4 flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-all group"
                >
                    {/* Drag Handle Icon */}
                    <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />

                    <div className="flex items-center gap-2 flex-1">
                        <div
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: status.color }}
                        />
                        <h3 className="font-semibold">{status.name}</h3>
                        <Badge variant="secondary" className="ml-1">
                            {status.tasks.length}
                        </Badge>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                        title="Delete status"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                </div>

                {/* Droppable Area - SortableContext only when tasks exist */}
                <div
                    className={`flex-1 space-y-0 min-h-[200px] p-3 rounded-lg transition-all duration-300 overflow-y-auto ${isOver
                        ? 'bg-primary/20 ring-4 ring-primary ring-offset-2 shadow-xl scale-[1.02]'
                        : 'bg-muted/20 hover:bg-muted/30'
                        }`}
                >
                    {status.tasks.length === 0 ? (
                        <div
                            className={`flex items-center justify-center h-32 text-sm font-medium border-2 border-dashed rounded-lg transition-all duration-300 ${isOver
                                ? 'border-primary text-primary bg-primary/10 border-4 scale-105'
                                : 'border-muted-foreground/30 text-muted-foreground'
                                }`}
                        >
                            {isOver ? '✨ Drop here' : 'No tasks'}
                        </div>
                    ) : (
                        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                            {status.tasks.map((task) => (
                                <KanbanCard key={task.id} task={task} />
                            ))}
                        </SortableContext>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the "{status.name}" status?
                            {status.tasks.length > 0 && (
                                <span className="block mt-2 text-destructive font-medium">
                                    ⚠️ This status has {status.tasks.length} task(s). Please reassign them first.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={status.tasks.length > 0}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default memo(KanbanColumn, (prevProps, nextProps) => {
    const prevStatus = prevProps.status;
    const nextStatus = nextProps.status;

    // Only re-render if status data actually changed
    return (
        prevStatus.id === nextStatus.id &&
        prevStatus.name === nextStatus.name &&
        prevStatus.color === nextStatus.color &&
        prevStatus.tasks.length === nextStatus.tasks.length &&
        prevStatus.tasks.every((task, index) => task.id === nextStatus.tasks[index]?.id)
    );
});
