import { useState, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SharedData, TaskCommentData } from '@/types';
import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CommentForm } from './comment-form';
import MDEditor, { commands } from '@uiw/react-md-editor';
import axios from 'axios';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface CommentItemProps {
    comment: TaskCommentData;
    taskId: number;
    depth?: number;
}

export function CommentItem({ comment, taskId, depth = 0 }: CommentItemProps) {
    const { auth } = usePage<SharedData>().props;
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isProcessing, setIsProcessing] = useState(false);

    const canEdit = auth.user.id === comment.user_id;
    const canDelete = canEdit || auth.user.roles?.some(role => role.name === 'super admin');
    const maxDepth = 2; // Limit nesting depth

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/comment-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data.url;
            }
            throw new Error('Upload failed');
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Failed to upload image. Please try again.');
            throw error;
        }
    };

    const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (!file) continue;

                if (file.size > 1024 * 1024) {
                    alert('Image size must not exceed 1MB');
                    continue;
                }

                // GitHub-style inline upload
                const filename = file.name || 'image.png';
                const placeholder = `![Uploading ${filename}...]()`;

                setEditContent(prev => prev + '\n' + placeholder + '\n');

                try {
                    const url = await uploadImage(file);
                    setEditContent(prev => prev.replace(placeholder, `![${filename}](${url})`));
                } catch (error) {
                    setEditContent(prev => prev.replace(placeholder, ''));
                }
            }
        }
    }, []);

    const handleDelete = () => {
        if (confirm('Delete this comment?')) {
            router.delete(
                `/task-management/all-tasks/${taskId}/comments/${comment.id}`,
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const handleUpdate = () => {
        if (!editContent.trim() || isProcessing) return;

        // Check if still uploading
        if (editContent.includes('![Uploading')) {
            alert('Please wait for image upload to complete');
            return;
        }

        setIsProcessing(true);
        router.put(
            `/task-management/all-tasks/${taskId}/comments/${comment.id}`,
            { content: editContent },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditing(false);
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            }
        );
    };

    const hasUploadingImage = editContent.includes('![Uploading');

    return (
        <div className={`flex gap-3 ${depth > 0 ? 'ml-12 mt-3' : ''}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-primary/10">
                    {getInitials(comment.user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                        {comment.created_at !== comment.updated_at && (
                            <span className="text-xs text-muted-foreground">(edited)</span>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-2 mt-2" data-color-mode="auto">
                            <MDEditor
                                value={editContent}
                                onChange={(val) => setEditContent(val || '')}
                                preview="edit"
                                height={150}
                                textareaProps={{
                                    onPaste: handlePaste,
                                }}
                                commands={[
                                    commands.bold,
                                    commands.italic,
                                    commands.strikethrough,
                                    commands.title,
                                    commands.divider,
                                    commands.link,
                                    commands.quote,
                                    commands.code,
                                    commands.codeBlock,
                                    commands.divider,
                                    commands.unorderedListCommand,
                                    commands.orderedListCommand,
                                    commands.checkedListCommand,
                                    commands.divider,
                                    commands.help,
                                ]}
                            />
                            {hasUploadingImage && (
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    ⏳ Uploading image... Please wait
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleUpdate} disabled={!editContent.trim() || isProcessing || hasUploadingImage}>
                                    {isProcessing ? 'Saving...' : 'Save'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none" data-color-mode="auto">
                            <MDEditor.Markdown source={comment.content} />
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex gap-2 mt-2">
                        {depth < maxDepth && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs h-7"
                            >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                        )}
                        {canEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="text-xs h-7"
                            >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="text-xs h-7 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                            </Button>
                        )}
                    </div>
                )}

                {showReplyForm && (
                    <div className="mt-3">
                        <CommentForm
                            taskId={taskId}
                            parentId={comment.id}
                            onSuccess={() => setShowReplyForm(false)}
                        />
                    </div>
                )}

                {/* Render replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                taskId={taskId}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
