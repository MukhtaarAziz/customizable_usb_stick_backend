<?php

namespace App\Http\Controllers;

use App\Models\ProgramPlatform;
use Illuminate\Http\Request;

class ProgramPlatformController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        return ProgramPlatform::paginate($perPage)->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        return ProgramPlatform::create($data);
    }

    public function show(string $id)
    {
        return ProgramPlatform::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $platform = ProgramPlatform::findOrFail($id);

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
        $platform = ProgramPlatform::findOrFail($id);
        $platform->delete();

        return response()->json(null, 204);
    }
}
