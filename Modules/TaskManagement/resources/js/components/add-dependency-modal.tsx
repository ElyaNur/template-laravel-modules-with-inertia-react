import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SharedData, TaskData } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AddDependencyModalProps {
    taskId: number;
    projectId: number;
}

export function AddDependencyModal({ taskId, projectId }: AddDependencyModalProps) {
    const [open, setOpen] = useState(false);
    const [availableTasks, setAvailableTasks] = useState<TaskData[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        depends_on_task_id: '',
        dependency_type: 'finish_to_start' as const,
    });

    const handleOpenChange = async (newOpen: boolean) => {
        setOpen(newOpen);

        if (newOpen && availableTasks.length === 0) {
            // Fetch available tasks when opening modal
            setLoading(true);
            try {
                const response = await fetch(
                    route('task-management.all-tasks.index', { project: projectId })
                );
                const result = await response.json();

                // Filter out the current task and tasks that are already dependencies
                const filtered = result.data.filter((task: TaskData) => task.id !== taskId);
                setAvailableTasks(filtered);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('task-management.all-tasks.dependencies.store', { task: taskId }), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Dependency
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Task Dependency</DialogTitle>
                        <DialogDescription>
                            Select a task that this task depends on
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {errors.depends_on_task_id && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.depends_on_task_id}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="depends_on_task_id">Task</Label>
                            <Select
                                value={data.depends_on_task_id}
                                onValueChange={(value) => setData('depends_on_task_id', value)}
                                disabled={loading}
                            >
                                <SelectTrigger id="depends_on_task_id">
                                    <SelectValue placeholder={loading ? "Loading tasks..." : "Select a task"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTasks.map((task) => (
                                        <SelectItem key={task.id} value={task.id.toString()}>
                                            {task.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dependency_type">Dependency Type</Label>
                            <Select
                                value={data.dependency_type}
                                onValueChange={(value) => setData('dependency_type', value as any)}
                            >
                                <SelectTrigger id="dependency_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="finish_to_start">
                                        Finish to Start (Default)
                                    </SelectItem>
                                    <SelectItem value="start_to_start">
                                        Start to Start
                                    </SelectItem>
                                    <SelectItem value="finish_to_finish">
                                        Finish to Finish
                                    </SelectItem>
                                    <SelectItem value="start_to_finish">
                                        Start to Finish
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Finish to Start: This task can only start when the dependency is completed
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.depends_on_task_id}>
                            Add Dependency
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
