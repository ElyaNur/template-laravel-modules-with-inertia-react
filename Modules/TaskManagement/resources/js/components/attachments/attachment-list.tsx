import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SharedData, TaskAttachmentData } from '@/types';
import { Download, Trash2, FileIcon, ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AttachmentListProps {
    attachments: TaskAttachmentData[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
    const { auth } = usePage<SharedData>().props;

    const handleDelete = (attachment: TaskAttachmentData) => {
        if (confirm(`Delete ${attachment.original_filename}?`)) {
            router.delete(
                `/task-management/attachments/${attachment.id}`,
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const handleDownload = (attachment: TaskAttachmentData) => {
        window.location.href = `/task-management/attachments/${attachment.id}/download`;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (attachments.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <FileIcon className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">No files attached yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {attachments.map((attachment) => (
                <Card key={attachment.id} className="p-4">
                    <div className="flex items-start gap-3">
                        {/* File Icon or Image Preview */}
                        <div className="flex-shrink-0">
                            {attachment.is_image ? (
                                <ImageIcon className="h-10 w-10 text-blue-500" />
                            ) : (
                                <FileIcon className="h-10 w-10 text-muted-foreground" />
                            )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                        {attachment.original_filename}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {attachment.human_size} • {attachment.mime_type}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(attachment)}
                                        className="h-8 w-8 p-0"
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    {(auth.user.id === attachment.uploaded_by ||
                                        auth.user.roles?.some(role => role.name === 'super admin')) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(attachment)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                </div>
                            </div>

                            {/* Uploader Info */}
                            <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs bg-primary/10">
                                        {getInitials(attachment.uploader.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">{attachment.uploader.name}</span>
                                    {' uploaded '}
                                    {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
