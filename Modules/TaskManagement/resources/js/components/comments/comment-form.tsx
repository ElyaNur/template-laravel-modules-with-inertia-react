import { useState, FormEvent, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import MDEditor, { commands } from '@uiw/react-md-editor';
import axios from 'axios';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface CommentFormProps {
    taskId: number;
    parentId?: number;
    onSuccess?: () => void;
}

export function CommentForm({ taskId, parentId, onSuccess }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

                // Check file size (1MB = 1024 * 1024 bytes)
                if (file.size > 1024 * 1024) {
                    alert('Image size must not exceed 1MB');
                    continue;
                }

                // GitHub-style: Show uploading placeholder immediately
                const filename = file.name || 'image.png';
                const placeholder = `![Uploading ${filename}...]()`;

                // Insert placeholder at cursor position
                setContent(prev => prev + '\n' + placeholder + '\n');

                try {
                    // Upload in background
                    const url = await uploadImage(file);

                    // Replace placeholder with actual image URL
                    setContent(prev => prev.replace(placeholder, `![${filename}](${url})`));
                } catch (error) {
                    // Remove placeholder on error
                    setContent(prev => prev.replace(placeholder, ''));
                }
            }
        }
    }, []);

    const handleDrop = useCallback(async (event: React.DragEvent) => {
        const files = event.dataTransfer?.files;
        if (!files) return;

        event.preventDefault();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.startsWith('image/')) continue;

            if (file.size > 1024 * 1024) {
                alert('Image size must not exceed 1MB');
                continue;
            }

            // GitHub-style: Show uploading placeholder
            const filename = file.name;
            const placeholder = `![Uploading ${filename}...]()`;

            setContent(prev => prev + '\n' + placeholder + '\n');

            try {
                const url = await uploadImage(file);
                setContent(prev => prev.replace(placeholder, `![${filename}](${url})`));
            } catch (error) {
                setContent(prev => prev.replace(placeholder, ''));
            }
        }
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || isSubmitting) return;

        // Check if still uploading
        if (content.includes('![Uploading')) {
            alert('Please wait for image upload to complete');
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/task-management/all-tasks/${taskId}/comments`,
            {
                content,
                parent_id: parentId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent('');
                    setIsSubmitting(false);
                    onSuccess?.();
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const hasUploadingImage = content.includes('![Uploading');

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div data-color-mode="auto">
                <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview="edit"
                    height={200}
                    textareaProps={{
                        placeholder: 'Write a comment... (Supports Markdown)',
                        onPaste: handlePaste,
                    }}
                    onDrop={handleDrop}
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
            </div>
            {hasUploadingImage && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                    ⏳ Uploading image... Please wait
                </p>
            )}
            <div className="flex justify-end gap-2">
                <Button
                    type="submit"
                    disabled={!content.trim() || isSubmitting || hasUploadingImage}
                >
                    {isSubmitting ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
                </Button>
            </div>
        </form>
    );
}
