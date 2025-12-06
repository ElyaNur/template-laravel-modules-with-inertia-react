import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData, TaskData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Calendar, User, CheckCircle2, MessageSquare, Activity, Paperclip, FileText } from 'lucide-react';
import { ReactNode } from 'react';
import { format } from 'date-fns';
import { CommentForm } from '../../components/comments/comment-form';
import { CommentItem } from '../../components/comments/comment-item';
import { ActivityTimeline } from '../../components/comments/activity-timeline';
import { FileUpload } from '../../components/attachments/file-upload';
import { AttachmentList } from '../../components/attachments/attachment-list';
import { DependencyList } from '../../components/dependency-list';
import { AddDependencyModal } from '../../components/add-dependency-modal';

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

const ShowTask = () => {
    const { task, taskComments, taskAttachments, activities } = usePage<SharedData & { task: TaskData }>().props;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Head title={task.title} />

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - Main Content (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Task Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-3 flex-1">
                                    <CardTitle className="text-2xl">{task.title}</CardTitle>
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
                                <Button asChild size="sm">
                                    <Link href={`/task-management/all-tasks/${task.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Description */}
                    {task.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Task Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Created By</p>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(task.creator.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{task.creator.name}</span>
                                    </div>
                                </div>

                                {task.deadline && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                                        <p className="text-sm font-medium">
                                            {format(new Date(task.deadline), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {task.assigned_users && task.assigned_users.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Assigned To</p>
                                    <div className="flex flex-wrap gap-2">
                                        {task.assigned_users.map((user) => (
                                            <div key={user.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{user.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <p className="text-xs text-muted-foreground">Created</p>
                                    <p className="text-sm">{format(new Date(task.created_at), 'MMM dd, yyyy HH:mm')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Updated</p>
                                    <p className="text-sm">{format(new Date(task.updated_at), 'MMM dd, yyyy HH:mm')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section - NOW IN MAIN COLUMN FOR MORE SPACE */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Comments ({taskComments?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CommentForm taskId={task.id} />
                            <Separator />
                            <div className="space-y-4">
                                {taskComments && taskComments.length > 0 ? (
                                    taskComments.map((comment) => (
                                        <CommentItem key={comment.id} comment={comment} taskId={task.id} />
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground text-sm py-8">
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN - Compact Sidebar (1/3 width) */}
                <div className="space-y-6">
                    {/* Dependencies Section */}
                    {task.dependencies || task.dependent_tasks ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Dependencies</h3>
                                <AddDependencyModal taskId={task.id} projectId={task.project_id || 0} />
                            </div>
                            <DependencyList
                                taskId={task.id}
                                dependencies={task.dependencies || []}
                                dependentTasks={task.dependent_tasks || []}
                                isBlocked={task.is_blocked || false}
                            />
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Dependencies</CardTitle>
                                    <AddDependencyModal taskId={task.id} projectId={task.project_id || 0} />
                                </div>
                            </CardHeader>
                        </Card>
                    )}

                    {/* Attachments Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments ({taskAttachments?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileUpload taskId={task.id} />
                            <div className="max-h-[400px] overflow-y-auto">
                                <AttachmentList attachments={taskAttachments || []} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[500px] overflow-y-auto">
                                <ActivityTimeline />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
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
