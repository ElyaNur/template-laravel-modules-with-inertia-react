import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { memo, useMemo, useCallback } from 'react';

type TaskData = {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    priority_color: string;
    deadline?: string;
    is_overdue: boolean;
    assigned_users: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    sort: number;
    formattedDeadline?: string | null;
};

type KanbanCardProps = {
    task: TaskData;
    isDragging?: boolean;
};

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
} as const;

// Memoized user avatar component to prevent cascade re-renders
const UserAvatar = memo(({ name }: { name: string }) => {
    const initials = useMemo(() => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, [name]);

    return (
        <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
    );
});

UserAvatar.displayName = 'UserAvatar';

function KanbanCard({ task, isDragging = false }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isActive,
    } = useSortable({
        id: task.id,
        transition: {
            duration: 200,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
        // Disable layout animations for better performance
        animateLayoutChanges: () => false,
    });

    // Memoize style calculation
    const style = useMemo(() => {
        if (!transform) return undefined;
        return {
            transform: CSS.Transform.toString(transform),
            transition,
        };
    }, [transform, transition]);

    // Memoize user list slicing
    const { displayUsers, extraCount } = useMemo(() => {
        return {
            displayUsers: task.assigned_users.slice(0, 3),
            extraCount: task.assigned_users.length - 3,
        };
    }, [task.assigned_users]);

    // Memoize click handler
    const handleLinkClick = useCallback(
        (e: React.MouseEvent) => {
            if (isActive) e.preventDefault();
        },
        [isActive]
    );

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="select-none mb-2"
            style={{
                ...style,
                contain: 'layout style paint',
                willChange: isActive ? 'transform' : 'auto',
            }}
        >
            <Card className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${isActive ? 'opacity-40' : ''}`}>
                <CardHeader className="p-3 pb-2">
                    <Link
                        href={`/task-management/all-tasks/${task.id}`}
                        className="font-medium text-sm hover:underline"
                        onClick={handleLinkClick}
                    >
                        {task.title}
                    </Link>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                    {/* Description */}
                    {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

                    {/* Priority Badge */}
                    <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                            borderColor: task.priority_color,
                            color: task.priority_color,
                        }}
                    >
                        {priorityLabels[task.priority]}
                    </Badge>

                    {/* Deadline */}
                    {task.deadline && (
                        <div className={`flex items-center gap-1 text-xs ${task.is_overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            {task.is_overdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                            <span>{task.formattedDeadline}</span>
                        </div>
                    )}

                    {/* Assigned Users */}
                    {task.assigned_users.length > 0 && (
                        <div className="flex -space-x-2">
                            {displayUsers.map((user) => (
                                <UserAvatar key={user.id} name={user.name} />
                            ))}
                            {extraCount > 0 && (
                                <Avatar className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-[10px]">+{extraCount}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Simple memo - context changes will still force re-renders (dnd-kit limitation)
// But this prevents re-renders from parent state changes
export default memo(KanbanCard);
