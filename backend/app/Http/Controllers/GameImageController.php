<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as InterventionImage;

/**
 * @group Game Images
 *
 * Upload, serve, and delete game images.
 */
class GameImageController extends Controller
{
    /**
     * Upload an image
     *
     * Upload a new image for a game. Creates both a full-size and a 300x300 thumbnail. Admin only.
     *
     * @subgroup Management
     * @authenticated
     *
     * @urlParam game int required The game ID. Example: 1
     *
     * @bodyParam image file required The image file (jpg, jpeg, png, gif, webp, max 10MB).
     * @bodyParam type string Image type label (e.g. "screenshot", "cover"). Example: screenshot
     * @bodyParam alt string Alt text for accessibility. Example: Gameplay screenshot
     *
     * @response status=201 {
     *   "id": 1,
     *   "game_id": 1,
     *   "path": "games/1/1234567890_abc123.jpg",
     *   "thumb_path": "games/1/thumbnails/thumb_1234567890_abc123.jpg",
     *   "type": "screenshot",
     *   "alt": null,
     *   "mime": "image/jpeg",
     *   "size": 2048576,
     *   "disk": "local"
     * }
     * @response status=422 {"message": "Uploaded file is not a valid image."}
     */
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

        $gameImage = GameImage::create([
            'game_id' => $game->id,
            'path' => $path,
            'thumb_path' => $thumbPath,
            'type' => $data['type'] ?? null,
            'alt' => $data['alt'] ?? null,
            'mime' => $imageFile->mime(),
            'size' => $file->getSize(),
            'disk' => 'local',
        ]);

        return response()->json($gameImage, 201);
    }

    /**
     * Get an image
     *
     * Serve the full-size image file directly.
     *
     * @subgroup Viewing
     * @unauthenticated
     *
     * @urlParam game int required The game ID. Example: 1
     * @urlParam image int required The image ID. Example: 1
     *
     * @response status=200 (image/png binary content)
     * @response status=404
     */
    public function show(Game $game, GameImage $gameImage)
    {
        if ($gameImage->game_id !== $game->id) {
            abort(404);
        }

        if (!Storage::disk($gameImage->disk)->exists($gameImage->path)) {
            abort(404);
        }

        $content = Storage::disk($gameImage->disk)->get($gameImage->path);
        return response($content, 200)
            ->header('Content-Type', $gameImage->mime ?? 'image/jpeg');
    }

    /**
     * Get a thumbnail
     *
     * Serve the 300x300 thumbnail of a game image.
     *
     * @subgroup Viewing
     * @unauthenticated
     *
     * @urlParam game int required The game ID. Example: 1
     * @urlParam image int required The image ID. Example: 1
     *
     * @response status=200 (image/png binary content)
     * @response status=404
     */
    public function showThumbnail(Game $game, GameImage $gameImage)
    {
        if ($gameImage->game_id !== $game->id) {
            abort(404);
        }

        if (empty($gameImage->thumb_path) || !Storage::disk($gameImage->disk)->exists($gameImage->thumb_path)) {
            abort(404);
        }

        $content = Storage::disk($gameImage->disk)->get($gameImage->thumb_path);
        return response($content, 200)
            ->header('Content-Type', $gameImage->mime ?? 'image/jpeg');
    }

    /**
     * Delete an image
     *
     * Delete a game image and its associated thumbnail. Admin only.
     *
     * @subgroup Management
     * @authenticated
     *
     * @urlParam game int required The game ID. Example: 1
     * @urlParam image int required The image ID. Example: 1
     *
     * @response status=204
     * @response status=404
     */
    public function destroy(Game $game, GameImage $gameImage)
    {
        if ($gameImage->game_id !== $game->id) {
            abort(404);
        }

        // delete thumbnail if exists
        if (!empty($gameImage->thumb_path)) {
            Storage::disk($gameImage->disk)->delete($gameImage->thumb_path);
        }

        Storage::disk($gameImage->disk)->delete($gameImage->path);
        $gameImage->delete();

        return response()->noContent();
    }
}
