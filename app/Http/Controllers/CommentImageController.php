<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CommentImageController extends Controller
{
    use AuthorizesRequests;

    /**
     * Upload an image from markdown editor.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:1024|mimes:jpg,jpeg,png,gif,webp',
        ], [
            'image.max' => 'Image must not exceed 1MB',
        ]);

        $file = $request->file('image');
        $uuid = Str::uuid();
        $extension = $file->getClientOriginalExtension();
        $filename = $uuid . '.' . $extension;

        // Store in private storage
        $path = $file->storeAs('comment-images', $filename);

        return response()->json([
            'success' => true,
            'url' => route('comment-images.show', $uuid),
            'uuid' => $uuid,
        ]);
    }

    /**
     * Serve an uploaded comment image.
     */
    public function show(string $uuid)
    {
        // Find the file with this UUID
        $files = Storage::files('comment-images');
        $matchingFile = null;

        foreach ($files as $file) {
            if (str_starts_with(basename($file), $uuid)) {
                $matchingFile = $file;
                break;
            }
        }

        if (!$matchingFile || !Storage::exists($matchingFile)) {
            abort(404, 'Image not found');
        }

        $mimeType = Storage::mimeType($matchingFile);
        
        return response(Storage::get($matchingFile))
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=31536000');
    }
}
