<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Category::with('categoryType');

        if ($typeId = $request->query('category_type_id')) {
            $query->where('category_type_id', $typeId);
        }

        return $query->paginate($perPage)->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_type_id' => ['required', 'exists:category_types,id'],
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        return Category::create($data);
    }

    public function show(string $id)
    {
        return Category::with('categoryType')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'category_type_id' => ['sometimes', 'required', 'exists:category_types,id'],
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
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
