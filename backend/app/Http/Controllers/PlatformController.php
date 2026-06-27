<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    public function index(Request $request)
    {
        // If frontend asks for all platforms, return full collection
        if ($request->query('show_all') === 'true' || $request->query('show_all') === '1') {
            return Platform::all();
        }

        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Platform::query();

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        return Platform::create($data);
    }

    public function show(string $id)
    {
        return Platform::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $platform = Platform::findOrFail($id);

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
        $platform = Platform::findOrFail($id);
        $platform->delete();

        return response()->json(null, 204);
    }
}
