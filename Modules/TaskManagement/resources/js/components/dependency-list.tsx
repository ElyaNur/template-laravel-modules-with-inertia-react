import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { TaskDependencyData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Link as LinkIcon, X, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DependencyListProps {
    taskId: number;
    dependencies: TaskDependencyData[];
    dependentTasks: TaskDependencyData[];
    isBlocked: boolean;
}

export function DependencyList({ taskId, dependencies = [], dependentTasks = [], isBlocked }: DependencyListProps) {
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleRemoveDependency = (dependencyId: number) => {
        setRemovingId(dependencyId);

        const form = useForm({});
        form.delete(route('task-management.all-tasks.dependencies.destroy', { task: taskId, dependency: dependencyId }), {
            preserveScroll: true,
            onSuccess: () => {
                setRemovingId(null);
            },
            onError: () => {
                setRemovingId(null);
            },
        });
    };

    const getDependencyTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'finish_to_start': 'Finish to Start',
            'start_to_start': 'Start to Start',
            'finish_to_finish': 'Finish to Finish',
            'start_to_finish': 'Start to Finish',
        };
        return labels[type] || type;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Task Dependencies
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isBlocked && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            This task is blocked by {dependencies.filter(d => !d.depends_on_task?.completed_at).length} incomplete task(s)
                        </AlertDescription>
                    </Alert>
                )}

                {/* Tasks this task depends on */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Depends On</h4>
                    {dependencies.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No dependencies</p>
                    ) : (
                        <div className="space-y-2">
                            {dependencies.map((dep) => (
                                <div
                                    key={dep.id}
                                    className="flex items-center justify-between gap-2 rounded-md border p-2"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm truncate">
                                                {dep.depends_on_task?.title || 'Unknown Task'}
                                            </span>
                                            {dep.depends_on_task?.completed_at ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {getDependencyTypeLabel(dep.dependency_type)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveDependency(dep.id)}
                                        disabled={removingId === dep.id}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tasks that depend on this task */}
                {dependentTasks.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Blocking Tasks</h4>
                        <div className="space-y-2">
                            {dependentTasks.map((dep) => (
                                <div
                                    key={dep.id}
                                    className="flex items-center gap-2 rounded-md border p-2 bg-muted/50"
                                >
                                    <span className="text-sm text-muted-foreground truncate">
                                        {dep.task?.title || 'Unknown Task'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            These tasks are waiting for this task to be completed
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
