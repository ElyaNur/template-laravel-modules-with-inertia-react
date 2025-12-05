import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, TaskData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Calendar, User, CheckCircle2 } from 'lucide-react';
import { ReactNode } from 'react';
import { format } from 'date-fns';

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

const ShowTask = () => {
    const { task } = usePage<SharedData & { task: TaskData }>().props;

    return (
        <>
            <Head title={task.title} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>{task.title}</CardTitle>
                        <div className="flex gap-2 items-center flex-wrap">
                            <Badge
                                variant="outline"
                                style={{
                                    borderColor: task.status.color,
                                    color: task.status.color,
                                }}
                            >
                                {task.status.name}
                            </Badge>
                            <Badge
                                variant="outline"
                                style={{
                                    borderColor: task.priority_color,
                                    color: task.priority_color,
                                }}
                            >
                                {priorityLabels[task.priority]}
                            </Badge>
                            {task.completed_at && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Completed
                                </Badge>
                            )}
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/task-management/all-tasks/${task.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Description */}
                    {task.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground">{task.description}</p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Creator */}
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Created By
                            </h3>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                        {task.creator.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{task.creator.name}</p>
                                    <p className="text-xs text-muted-foreground">{task.creator.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Deadline */}
                        {task.deadline && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Deadline
                                </h3>
                                <p className="text-sm">
                                    {format(new Date(task.deadline), 'PPP')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Assigned Users */}
                    {task.assigned_users.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3">Assigned To</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {task.assigned_users.map((user) => (
                                    <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg border">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <span className="font-medium">Created:</span>{' '}
                                {format(new Date(task.created_at), 'PPpp')}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span>{' '}
                                {format(new Date(task.updated_at), 'PPpp')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task-management/all-tasks',
    },
    {
        title: 'Details',
    },
];

ShowTask.layout = (page: ReactNode) => <AppLayout children={page} breadcrumbs={breadcrumbs} />;

export default ShowTask;
