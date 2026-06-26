<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GamePlatform;

class GamePlatformController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        return GamePlatform::paginate($perPage)->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        return GamePlatform::create($data);
    }

    public function show(string $id)
    {
        return GamePlatform::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $platform = GamePlatform::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        $platform->update($data);

        return $platform;
    }

    public function destroy(string $id)
    {
        $platform = GamePlatform::findOrFail($id);
        $platform->delete();

        return response()->json(null, 204);
    }
}
