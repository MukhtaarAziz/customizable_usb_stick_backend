<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as InterventionImage;

class GameImageController extends Controller
{
    public function store(Request $request, Game $game)
    {
        $data = $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png,gif,webp|max:10240', // max 10MB
            'type' => 'nullable|string',
            'alt' => 'nullable|string',
        ]);

        $file = $request->file('image');
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . uniqid() . '.' . $ext;
        $folder = "games/{$game->id}";
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

        $image = Image::create([
            'game_id' => $game->id,
            'path' => $path,
            'thumb_path' => $thumbPath,
            'type' => $data['type'] ?? null,
            'alt' => $data['alt'] ?? null,
            'mime' => $imageFile->mime(),
            'size' => $file->getSize(),
            'disk' => 'local',
        ]);

        return response()->json($image, 201);
    }

    public function show(Game $game, Image $image)
    {
        if ($image->game_id !== $game->id) {
            abort(404);
        }

        if (!Storage::disk($image->disk)->exists($image->path)) {
            abort(404);
        }

        $content = Storage::disk($image->disk)->get($image->path);
        return response($content, 200)
            ->header('Content-Type', $image->mime ?? 'image/jpeg');
    }

    public function showThumbnail(Game $game, Image $image)
    {
        if ($image->game_id !== $game->id) {
            abort(404);
        }

        if (empty($image->thumb_path) || !Storage::disk($image->disk)->exists($image->thumb_path)) {
            abort(404);
        }

        $content = Storage::disk($image->disk)->get($image->thumb_path);
        return response($content, 200)
            ->header('Content-Type', $image->mime ?? 'image/jpeg');
    }

    public function destroy(Game $game, Image $image)
    {
        if ($image->game_id !== $game->id) {
            abort(404);
        }

        // delete thumbnail if exists
        if (!empty($image->thumb_path)) {
            Storage::disk($image->disk)->delete($image->thumb_path);
        }

        Storage::disk($image->disk)->delete($image->path);
        $image->delete();

        return response()->noContent();
    }
}
