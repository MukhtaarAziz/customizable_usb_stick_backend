<?php

namespace App\Http\Controllers;

use App\Models\CategoryType;
use Illuminate\Http\Request;

class CategoryTypeController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = CategoryType::query();

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
        ]);

        return CategoryType::create($data);
    }

    public function show(string $id)
    {
        return CategoryType::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $categoryType = CategoryType::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255'],
        ]);

        $categoryType->update($data);

        return $categoryType;
    }

    public function destroy(string $id)
    {
        $categoryType = CategoryType::findOrFail($id);
        $categoryType->delete();

        return response()->json(null, 204);
    }
}
