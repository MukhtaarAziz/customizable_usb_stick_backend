<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as InterventionImage;

class ProgramImageController extends Controller
{
    public function store(Request $request, Program $program)
    {
        $data = $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png,gif,webp|max:10240',
            'type' => 'nullable|string',
            'alt' => 'nullable|string',
        ]);

        $file = $request->file('image');
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . uniqid() . '.' . $ext;
        $folder = "programs/{$program->id}";
        $path = $folder . '/' . $filename;

        $imageFile = InterventionImage::make($file->getRealPath());
        if (!$imageFile->mime()) {
            return response()->json(['message' => 'Uploaded file is not a valid image.'], 422);
        }

        Storage::disk('local')->put($path, $imageFile->encode($ext, 90));

        $thumbFolder = $folder . '/thumbnails';
        $thumbFilename = 'thumb_' . $filename;
        $thumbPath = $thumbFolder . '/' . $thumbFilename;

        $thumbnail = $imageFile->resize(300, 300, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        Storage::disk('local')->put($thumbPath, $thumbnail->encode($ext, 80));

        $programImage = ProgramImage::create([
            'program_id' => $program->id,
            'path' => $path,
            'thumb_path' => $thumbPath,
            'type' => $data['type'] ?? null,
            'alt' => $data['alt'] ?? null,
            'mime' => $imageFile->mime(),
            'size' => $file->getSize(),
            'disk' => 'local',
        ]);

        return response()->json($programImage, 201);
    }

    public function show(Program $program, ProgramImage $programImage)
    {
        if ($programImage->program_id !== $program->id) {
            abort(404);
        }

        if (!Storage::disk($programImage->disk)->exists($programImage->path)) {
            abort(404);
        }

        $content = Storage::disk($programImage->disk)->get($programImage->path);
        return response($content, 200)
            ->header('Content-Type', $programImage->mime ?? 'image/jpeg');
    }

    public function showThumbnail(Program $program, ProgramImage $programImage)
    {
        if ($programImage->program_id !== $program->id) {
            abort(404);
        }

        if (empty($programImage->thumb_path) || !Storage::disk($programImage->disk)->exists($programImage->thumb_path)) {
            abort(404);
        }

        $content = Storage::disk($programImage->disk)->get($programImage->thumb_path);
        return response($content, 200)
            ->header('Content-Type', $programImage->mime ?? 'image/jpeg');
    }

    public function destroy(Program $program, ProgramImage $programImage)
    {
        if ($programImage->program_id !== $program->id) {
            abort(404);
        }

        if (!empty($programImage->thumb_path)) {
            Storage::disk($programImage->disk)->delete($programImage->thumb_path);
        }

        Storage::disk($programImage->disk)->delete($programImage->path);
        $programImage->delete();

        return response()->noContent();
    }
}
