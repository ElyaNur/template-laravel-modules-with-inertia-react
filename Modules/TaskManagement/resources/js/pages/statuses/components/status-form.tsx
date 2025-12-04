import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

type StatusFormProps = {
    type: 'create' | 'edit';
    status?: {
        id: number;
        name: string;
        slug: string;
        color: string;
        is_default: boolean;
        is_completed: boolean;
    };
    defaultSort?: number;
};

export default function StatusForm({ type, status, defaultSort }: StatusFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: status?.name || '',
        slug: status?.slug || '',
        color: status?.color || '#3b82f6',
        sort: defaultSort || 0,
        is_default: status?.is_default || false,
        is_completed: status?.is_completed || false,
    });

    // Auto-generate slug from name
    useEffect(() => {
        if (type === 'create') {
            const slug = data.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            setData('slug', slug);
        }
    }, [data.name, type]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (type === 'edit' && status) {
            put(`/task-management/task-statuses/${status.id}`, {
                preserveScroll: true,
            });
        } else {
            post('/task-management/task-statuses', {
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Status Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. In Progress, Blocked, Testing"
                    className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="e.g. in-progress, blocked, testing"
                    className={errors.slug ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">URL-friendly identifier (auto-generated from name)</p>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            {/* Color */}
            <div className="space-y-2">
                <Label htmlFor="color">
                    Color <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-3 items-center">
                    <Input
                        id="color"
                        type="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        placeholder="#3b82f6"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        className={`flex-1 ${errors.color ? 'border-destructive' : ''}`}
                    />
                    <div
                        className="h-10 w-10 rounded border flex-shrink-0"
                        style={{ backgroundColor: data.color }}
                    />
                </div>
                {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="is_default">Set as Default</Label>
                        <p className="text-sm text-muted-foreground">New tasks will use this status by default</p>
                    </div>
                    <Switch id="is_default" checked={data.is_default} onCheckedChange={(checked) => setData('is_default', checked)} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="is_completed">Mark as Completed</Label>
                        <p className="text-sm text-muted-foreground">Tasks moved to this status are marked as completed</p>
                    </div>
                    <Switch id="is_completed" checked={data.is_completed} onCheckedChange={(checked) => setData('is_completed', checked)} />
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : type === 'edit' ? 'Update Status' : 'Create Status'}
                </Button>
            </div>
        </form>
    );
}

