<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Program::with(['category', 'platform', 'images']);

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        if ($platformId = $request->query('platform_id')) {
            $query->where('platform_id', $platformId);
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        return $query
            ->paginate($perPage)
            ->appends($request->query());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:programs,name_en'],
            'name_ar' => ['required', 'string', 'max:255', 'unique:programs,name_ar'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'platform_id' => ['required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_mb' => ['required', 'integer', 'min:0'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
            'active' => ['nullable', 'boolean'],
        ]);

        return Program::create($data);
    }

    public function show(string $id)
    {
        return Program::with(['category', 'platform'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $program = Program::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255', 'unique:programs,name_en,' . $id],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255', 'unique:programs,name_ar,' . $id],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'platform_id' => ['sometimes', 'required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_mb' => ['sometimes', 'required', 'integer', 'min:0'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
            'active' => ['nullable', 'boolean'],
        ]);

        $program->update($data);

        return $program;
    }

    public function toggleActive(Request $request, string $id)
    {
        $program = Program::findOrFail($id);

        $data = $request->validate([
            'active' => ['required', 'boolean'],
        ]);

        $program->update($data);

        return $program;
    }

    public function destroy(string $id)
    {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(null, 204);
    }
}
