import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    rectIntersection,
    closestCenter,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Plus } from 'lucide-react';
import KanbanColumn from './kanban-column';
import KanbanCard from './kanban-card';
import { KanbanStatusData, KanbanTaskData } from '@/types';

// Extended type for internal state with formatted deadline
type TaskDataWithFormatted = KanbanTaskData & {
    formattedDeadline?: string | null;
};

type StatusDataWithFormatted = Omit<KanbanStatusData, 'tasks'> & {
    tasks: TaskDataWithFormatted[];
};

type KanbanBoardProps = {
    statuses: KanbanStatusData[];
    selectedProject?: number | null;
};

export default function KanbanBoard({ statuses: initialStatuses, selectedProject }: KanbanBoardProps) {
    const [activeTask, setActiveTask] = useState<KanbanTaskData | null>(null);
    const [activeColumn, setActiveColumn] = useState<KanbanStatusData | null>(null);
    const [statuses, setStatuses] = useState<StatusDataWithFormatted[]>(initialStatuses);
    const isDraggingRef = useRef(false);
    const dragTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Sync state when props change (e.g., after delete from backend)
    useEffect(() => {
        setStatuses(initialStatuses);
    }, [initialStatuses]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Custom collision detection for column + task contexts
    const collisionDetectionStrategy = useCallback((args: any) => {
        const { active } = args;
        const activeData = active.data.current;

        // Column drag - only detect column drop zones
        if (activeData?.type === 'column') {
            return closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                    (container: any) => container.id.toString().startsWith('column-')
                ),
            });
        }

        // Task drag - use rect intersection (existing)
        return rectIntersection(args);
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const activeData = active.data.current;
        isDraggingRef.current = true;

        if (activeData?.type === 'column') {
            // Dragging a column
            setActiveColumn(activeData.status);
        } else {
            // Dragging a task
            const task = initialStatuses
                .flatMap((status) => status.tasks)
                .find((task) => task.id === active.id);

            if (task) {
                setActiveTask(task);
            }
        }
    }, [initialStatuses]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        if (!isDraggingRef.current) return;

        const { active } = event;
        const activeData = active.data.current;

        // Skip if dragging column
        if (activeData?.type === 'column') return;

        // Throttle updates - only update every 16ms (60fps)
        if (dragTimeoutRef.current) return;

        dragTimeoutRef.current = setTimeout(() => {
            dragTimeoutRef.current = undefined;
        }, 16);

        const { over } = event;
        if (!over || !active) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        setStatuses((currentStatuses) => {
            const activeStatus = currentStatuses.find((status) =>
                status.tasks.some((task) => task.id === activeId)
            );
            const overStatus = currentStatuses.find(
                (status) =>
                    status.id === overId || status.tasks.some((task) => task.id === overId)
            );

            if (!activeStatus || !overStatus) return currentStatuses;

            // Same column reordering
            if (activeStatus.id === overStatus.id) {
                const activeIndex = activeStatus.tasks.findIndex((t) => t.id === activeId);
                const overIndex = activeStatus.tasks.findIndex((t) => t.id === overId);

                if (activeIndex === overIndex || activeIndex === -1 || overIndex === -1) {
                    return currentStatuses;
                }

                return currentStatuses.map((status) => {
                    if (status.id === activeStatus.id) {
                        return {
                            ...status,
                            tasks: arrayMove(status.tasks, activeIndex, overIndex),
                        };
                    }
                    return status;
                });
            }

            // Different columns
            const activeItems = activeStatus.tasks;
            const activeIndex = activeItems.findIndex((t) => t.id === activeId);

            if (activeIndex === -1) return currentStatuses;

            const alreadyInTarget = overStatus.tasks.some((t) => t.id === activeId);
            if (alreadyInTarget) return currentStatuses;

            const overIndex = overStatus.tasks.findIndex((t) => t.id === overId);
            const newIndex = overIndex >= 0 ? overIndex : overStatus.tasks.length;

            return currentStatuses.map((status) => {
                if (status.id === activeStatus.id) {
                    return {
                        ...status,
                        tasks: status.tasks.filter((task) => task.id !== activeId),
                    };
                } else if (status.id === overStatus.id) {
                    const newTasks = [...status.tasks];
                    newTasks.splice(newIndex, 0, activeItems[activeIndex]);
                    return {
                        ...status,
                        tasks: newTasks,
                    };
                }
                return status;
            });
        });
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        const activeData = active.data.current;
        isDraggingRef.current = false;

        // Clear throttle timeout
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = undefined;
        }

        if (activeData?.type === 'column') {
            // Column drag end
            setActiveColumn(null);

            if (!over) return;

            const activeId = active.id.toString().replace('column-', '');
            const overId = over.id.toString().replace('column-', '');

            if (activeId === overId) return;

            setStatuses(currentStatuses => {
                const oldIndex = currentStatuses.findIndex(s => s.id === Number(activeId));
                const newIndex = currentStatuses.findIndex(s => s.id === Number(overId));

                const reordered = arrayMove(currentStatuses, oldIndex, newIndex);

                // Persist to backend
                router.patch(
                    `/task-management/task-statuses/reorder`,
                    {
                        statuses: reordered.map((s, index) => ({
                            id: s.id,
                            sort: index
                        }))
                    },
                    {
                        preserveScroll: true,
                        onError: () => setStatuses(initialStatuses),
                    }
                );

                return reordered;
            });
            return;
        }

        // Task drag end (existing logic)
        setActiveTask(null);

        if (!over) {
            setStatuses(initialStatuses);
            return;
        }

        const taskId = active.id as number;
        const targetId = over.id;

        // Find which status we dropped onto
        const overData = over.data.current;
        let targetStatus;

        if (overData?.type === 'column') {
            // Dropped on column droppable - extract status ID from "column-X" format
            const statusId = Number(targetId.toString().replace('column-', ''));
            targetStatus = statuses.find((status) => status.id === statusId);
        } else if (overData?.type === 'status') {
            // Dropped on status droppable area
            targetStatus = statuses.find((status) => status.id === Number(targetId));
        } else {
            // Check if dropped on task - find which column that task is in
            targetStatus = statuses.find((status) => status.id === Number(targetId));

            if (!targetStatus) {
                targetStatus = statuses.find((status) =>
                    status.tasks.some((task) => task.id === Number(targetId))
                );
            }
        }

        if (!targetStatus) {
            setStatuses(initialStatuses);
            return;
        }

        // Update local state immediately AND make backend call with fresh state
        setStatuses((currentStatuses) => {
            const sourceStatus = currentStatuses.find((s) => s.tasks.some((t) => t.id === taskId));
            if (!sourceStatus) return currentStatuses;

            const task = sourceStatus.tasks.find((t) => t.id === taskId);
            if (!task) return currentStatuses;

            let newStatuses: typeof currentStatuses;

            // If already in target, just reorder
            if (sourceStatus.id === targetStatus.id) {
                const oldIndex = sourceStatus.tasks.findIndex((t) => t.id === taskId);
                const newIndex = sourceStatus.tasks.findIndex((t) => t.id === targetId);
                if (oldIndex !== -1 && newIndex !== -1) {
                    newStatuses = currentStatuses.map((s) => {
                        if (s.id === sourceStatus.id) {
                            return { ...s, tasks: arrayMove(s.tasks, oldIndex, newIndex) };
                        }
                        return s;
                    });
                } else {
                    return currentStatuses;
                }
            } else {
                // Move to different column
                newStatuses = currentStatuses.map((s) => {
                    if (s.id === sourceStatus.id) {
                        return { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) };
                    } else if (s.id === targetStatus.id) {
                        const targetTaskIndex = s.tasks.findIndex((t) => t.id === targetId);
                        const newTasks = [...s.tasks];
                        if (targetTaskIndex >= 0) {
                            newTasks.splice(targetTaskIndex, 0, task);
                        } else {
                            newTasks.push(task);
                        }
                        return { ...s, tasks: newTasks };
                    }
                    return s;
                });
            }

            // NOW use the FRESH state to calculate task index for backend
            const updatedTargetStatus = newStatuses.find(s => s.id === targetStatus.id);
            if (updatedTargetStatus) {
                const taskIndex = updatedTargetStatus.tasks.findIndex(t => t.id === taskId);

                if (taskIndex >= 0) {
                    router.patch(
                        `/task-management/all-tasks/${taskId}/status`,
                        {
                            task_status_id: targetStatus.id,
                            sort: taskIndex,
                        },
                        {
                            preserveScroll: true,
                            onError: () => {
                                setStatuses(initialStatuses);
                            },
                        }
                    );
                }
            }

            return newStatuses;
        });
    }, [statuses, initialStatuses]);

    // Pre-compute formatted dates for all tasks (runs once per state change)
    const enhancedStatuses = useMemo<StatusDataWithFormatted[]>(() =>
        statuses.map(status => ({
            ...status,
            tasks: status.tasks.map(task => ({
                ...task,
                formattedDeadline: task.deadline
                    ? formatDistanceToNow(new Date(task.deadline), { addSuffix: true })
                    : null
            }))
        })),
        [statuses]
    );

    // Column IDs for horizontal sortable
    const columnIds = useMemo(
        () => enhancedStatuses.map(s => `column-${s.id}`),
        [enhancedStatuses]
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {/* Horizontal SortableContext for columns */}
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-12rem)]">
                    {enhancedStatuses.map(status => (
                        <KanbanColumn
                            key={status.id}
                            status={status}
                            isDraggingColumn={activeColumn?.id === status.id}
                        />
                    ))}

                    {/* Create New Status Button */}
                    <Link
                        href={`/task-management/task-statuses/create?return=kanban${selectedProject ? `&project_id=${selectedProject}` : ''}`}
                        className="flex flex-col w-80 flex-shrink-0 min-h-[200px] p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/50 transition-all group"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                            <div className="p-3 bg-muted/50 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Plus className="h-6 w-6" />
                            </div>
                            <p className="font-medium">Add Status</p>
                        </div>
                    </Link>
                </div>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
                {activeColumn ? (
                    <div className="opacity-90 rotate-2 scale-105">
                        <KanbanColumn status={activeColumn} isDraggingColumn />
                    </div>
                ) : activeTask ? (
                    <KanbanCard task={activeTask} isDragging />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
