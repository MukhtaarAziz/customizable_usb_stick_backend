<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GameCategory;

class GameCategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        return GameCategory::paginate($perPage)->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        $data['category_type_id'] = 1;

        return GameCategory::create($data);
    }

    public function show(string $id)
    {
        return GameCategory::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $category = GameCategory::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        $category->update($data);

        return $category;
    }

    public function destroy(string $id)
    {
        $category = GameCategory::findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
