<?php

namespace Modules\TaskManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\TaskManagement\Models\Task;
use Modules\TaskManagement\Models\TaskAttachment;

class TaskAttachmentController extends Controller
{
    use AuthorizesRequests;
    /**
     * Upload file(s) to a task.
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'files' => 'required|array|max:5',
            'files.*' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,txt,jpg,jpeg,png,gif,zip,rar',
        ], [
            'files.*.max' => 'Each file must not exceed 10MB',
            'files.*.mimes' => 'Allowed file types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, ZIP, RAR',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store in private storage (not publicly accessible)
            $path = $file->storeAs('task-attachments', $filename);

            // Create attachment record
            $attachment = $task->attachments()->create([
                'uploaded_by' => auth()->id(),
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

            $uploadedFiles[] = $attachment;

            // Log activity for each upload
            activity('task')
                ->performedOn($task)
                ->withProperties([
                    'filename' => $attachment->original_filename,
                    'size' => $attachment->size,
                ])
                ->log('attachment_uploaded');
        }

        // TODO: Notify assigned users about new files (Phase 3)
        // $task->assignedUsers()
        //     ->where('id', '!=', auth()->id())
        //     ->each(fn($user) => $user->notify(new FileUploadedNotification($task, $uploadedFiles)));

        return back()->with('toast', [
            'success' => true,
            'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
        ]);
    }

    /**
     * Download a file attachment.
     */
    public function download(TaskAttachment $attachment)
    {
        $this->authorize('view', $attachment->task);

        if (!Storage::exists($attachment->path)) {
            abort(404, 'File not found');
        }

        return Storage::download(
            $attachment->path,
            $attachment->original_filename
        );
    }

    /**
     * Delete a file attachment.
     */
    public function destroy(TaskAttachment $attachment)
    {
        $this->authorize('update', $attachment->task);

        // Delete file from private storage
        if (Storage::exists($attachment->path)) {
            Storage::delete($attachment->path);
        }

        // Log activity before deleting attachment record
        activity('task')
            ->performedOn($attachment->task)
            ->withProperties([
                'filename' => $attachment->original_filename,
            ])
            ->log('attachment_deleted');

        // Delete database record
        $attachment->delete();

        return back()->with('toast', [
            'success' => true,
            'message' => 'File deleted successfully',
        ]);
    }
}
