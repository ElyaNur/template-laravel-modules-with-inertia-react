import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';
import { Calendar } from 'lucide-react';

type TaskFormProps = {
    task?: {
        id: number;
        title: string;
        description?: string;
        task_status_id: number;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        deadline?: string;
        assigned_users: Array<{ id: number }>;
    };
    statuses: Array<{ id: number; name: string; color: string }>;
    users: Array<{ id: number; name: string; email: string }>;
    type: 'create' | 'edit' | 'show';
};

export default function TaskForm({ task, statuses, users, type }: TaskFormProps) {
    const isDisabled = type === 'show';

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        task_status_id: task?.task_status_id || statuses[0]?.id || 0,
        priority: task?.priority || 'medium',
        deadline: task?.deadline ? task.deadline.split('T')[0] : '',
        assigned_users: task?.assigned_users.map((u) => u.id) || [],
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (type === 'show') return;

        if (type === 'edit' && task) {
            put(`/task-management/all-tasks/${task.id}`, {
                preserveScroll: true,
            });
        } else {
            post('/task-management/all-tasks', {
                preserveScroll: true,
            });
        }
    };

    // Memoize to prevent recalculation on every render
    const userOptions = useMemo(
        () =>
            users.map((user) => ({
                label: user.name,
                value: user.id.toString(),
            })),
        [users]
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter task title"
                    className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter task description"
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">
                        Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.task_status_id.toString()}
                        onValueChange={(value) => setData('task_status_id', parseInt(value))}
                        disabled={isDisabled}
                    >
                        <SelectTrigger className={errors.task_status_id ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map((status) => (
                                <SelectItem key={status.id} value={status.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: status.color }}
                                        />
                                        {status.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.task_status_id && <p className="text-sm text-destructive">{errors.task_status_id}</p>}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <Label htmlFor="priority">
                        Priority <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.priority}
                        onValueChange={(value) => setData('priority', value as any)}
                        disabled={isDisabled}
                    >
                        <SelectTrigger className={errors.priority ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#94a3b8]" />
                                    Low
                                </div>
                            </SelectItem>
                            <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
                                    Medium
                                </div>
                            </SelectItem>
                            <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                                    High
                                </div>
                            </SelectItem>
                            <SelectItem value="urgent">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
                                    Urgent
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
                <Label htmlFor="deadline">
                    Deadline
                </Label>
                <div className="relative">
                    <Input
                        id="deadline"
                        type="date"
                        value={data.deadline}
                        onChange={(e) => setData('deadline', e.target.value)}
                        disabled={isDisabled}
                        className={errors.deadline ? 'border-destructive' : ''}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
            </div>

            {/* Assigned Users */}
            <div className="space-y-2">
                <Label htmlFor="assigned_users">Assigned Users</Label>
                <MultiSelect
                    options={userOptions}
                    defaultValue={data.assigned_users.map((id) => id.toString())}
                    onValueChange={(values) => setData('assigned_users', values.map((v) => parseInt(v)))}
                    disabled={isDisabled}
                    placeholder="Select users..."
                />
                {errors.assigned_users && <p className="text-sm text-destructive">{errors.assigned_users}</p>}
            </div>

            {/* Submit Buttons */}
            {type !== 'show' && (
                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : type === 'edit' ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            )}
        </form>
    );
}
