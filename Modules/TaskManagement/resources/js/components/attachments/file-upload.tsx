import { useState, useRef, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, FileIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
    taskId: number;
    maxFiles?: number;
}

export function FileUpload({ taskId, maxFiles = 5 }: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const remainingSlots = maxFiles - selectedFiles.length;
            const filesToAdd = filesArray.slice(0, remainingSlots);
            setSelectedFiles([...selectedFiles, ...filesToAdd]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0 || isUploading) return;

        setIsUploading(true);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(
            `/task-management/all-tasks/${taskId}/attachments`,
            formData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedFiles([]);
                    setIsUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
                onError: () => {
                    setIsUploading(false);
                },
            }
        );
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isUploading || selectedFiles.length >= maxFiles}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    className="flex-1"
                />
                <Button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || isUploading}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload ({selectedFiles.length})
                </Button>
            </div>

            {selectedFiles.length > 0 && (
                <Card className="p-4">
                    <h4 className="text-sm font-semibold mb-3">Ready to upload:</h4>
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-2 rounded border bg-background"
                            >
                                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    disabled={isUploading}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        Max {maxFiles} files, 10MB each. Supported: PDF, DOC, XLS, TXT, Images, ZIP
                    </p>
                </Card>
            )}
        </div>
    );
}
