import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

type TaskStatusData = {
    id: number;
    name: string;
    slug: string;
    color: string;
    sort: number;
    is_default: boolean;
    is_completed: boolean;
    tasks_count: number;
};

type SortableStatusRowProps = {
    status: TaskStatusData;
};

export function SortableStatusRow({ status }: SortableStatusRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: status.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${status.name}"?`)) {
            router.delete(`/task-management/task-statuses/${status.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="font-medium">{status.name}</span>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-muted-foreground">{status.tasks_count}</span>
            </TableCell>
            <TableCell>
                {status.is_default && (
                    <Badge variant="secondary" className="text-xs">
                        Default
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {status.is_completed && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Yes
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/task-management/task-statuses/${status.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
