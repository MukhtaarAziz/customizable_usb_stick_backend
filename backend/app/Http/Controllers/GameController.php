<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Game::with(['category', 'platform', 'images']);

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ar' => ['required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'platform_id' => ['required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_gb' => ['required', 'numeric'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
        ]);

        return Game::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Game::with(['category', 'platform'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $game = Game::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'platform_id' => ['sometimes', 'required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_gb' => ['sometimes', 'required', 'numeric'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
        ]);

        $game->update($data);

        return $game;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return response()->json(null, 204);
    }
}
