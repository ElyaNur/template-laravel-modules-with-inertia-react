import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProjectData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

type ProjectFormProps = {
    type: 'create' | 'edit';
    project?: ProjectData;
};

export default function ProjectForm({ type, project }: ProjectFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: project?.name || '',
        slug: project?.slug || '',
        description: project?.description || '',
        color: project?.color || '#3b82f6',
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

        if (type === 'edit' && project) {
            put(`/task-management/projects/${project.id}`, {
                preserveScroll: true,
            });
        } else {
            post('/task-management/projects', {
                preserveScroll: true,
            });
        }
    };

    const colorPresets = [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Orange
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#14b8a6', // Teal
        '#f97316', // Orange
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Website Redesign, Mobile App"
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
                    placeholder="e.g. website-redesign, mobile-app"
                    className={errors.slug ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">URL-friendly identifier (auto-generated from name)</p>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Brief description of the project's goals and scope..."
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Color */}
            <div className="space-y-2">
                <Label htmlFor="color">
                    Project Color <span className="text-destructive">*</span>
                </Label>

                {/* Color Presets */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {colorPresets.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => setData('color', preset)}
                            className={`w-10 h-10 rounded-md border-2 ${data.color === preset ? 'border-foreground ring-2 ring-offset-2' : 'border-muted'
                                }`}
                            style={{ backgroundColor: preset }}
                        />
                    ))}
                </div>

                {/* Custom Color Picker */}
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
                <p className="text-xs text-muted-foreground">Choose a color to help identify this project</p>
                {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : type === 'edit' ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
}
