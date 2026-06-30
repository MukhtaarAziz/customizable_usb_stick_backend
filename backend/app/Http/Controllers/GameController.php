<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

/**
 * @group Games
 *
 * Manage games.
 */
class GameController extends Controller
{
    /**
     * List games
     *
     * Get a paginated list of games, filterable by search, platform, and category.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @queryParam per_page int Results per page (1-100). Defaults to 15. Example: 15
     * @queryParam search string Search by English or Arabic name. Example: war
     * @queryParam platform_id int Filter by platform ID. Example: 1
     * @queryParam category_id int Filter by category ID. Example: 2
     *
     * @responseField data[].id int Game ID.
     * @responseField data[].name_en string English name.
     * @responseField data[].name_ar string Arabic name.
     * @responseField data[].size_gb float Size in GB.
     * @responseField data[].category object The game category.
     * @responseField data[].platform object The gaming platform.
     * @responseField data[].images array List of images.
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
     * Create a game
     *
     * Add a new game entry. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @bodyParam name_en string required English name. Example: Call of Duty
     * @bodyParam name_ar string required Arabic name. Example: كول أوف ديوتي
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam category_id int required Category ID. Example: 1
     * @bodyParam platform_id int required Platform ID. Example: 1
     * @bodyParam tags string[] Array of tags. Example: ["shooter", "multiplayer"]
     * @bodyParam size_gb numeric required Game file size in GB. Example: 72.5
     * @bodyParam downloads int Download count. Example: 15000
     * @bodyParam date_release date Release date. Example: 2024-10-25
     *
     * @response status=201 {"id": 1, "name_en": "Call of Duty", "name_ar": "كول أوف ديوتي", "size_gb": 72.5, ...}
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:games,name_en'],
            'name_ar' => ['required', 'string', 'max:255', 'unique:games,name_ar'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'platform_id' => ['required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_gb' => ['required', 'numeric'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
            'active' => ['nullable', 'boolean'],
        ]);

        return Game::create($data);
    }

    /**
     * Show a game
     *
     * Get details of a single game by ID with its category and platform.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam id int required The game ID. Example: 1
     *
     * @response {"id": 1, "name_en": "Call of Duty", "name_ar": "كول أوف ديوتي", "size_gb": 72.5, "category": {...}, "platform": {...}}
     */
    public function show(string $id)
    {
        return Game::with(['category', 'platform'])->findOrFail($id);
    }

    /**
     * Update a game
     *
     * Update an existing game entry. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The game ID. Example: 1
     *
     * @bodyParam name_en string English name.
     * @bodyParam name_ar string Arabic name.
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam category_id int Category ID.
     * @bodyParam platform_id int Platform ID.
     * @bodyParam tags string[] Array of tags.
     * @bodyParam size_gb numeric Game file size in GB.
     * @bodyParam downloads int Download count.
     * @bodyParam date_release date Release date.
     *
     * @response {"id": 1, "name_en": "Call of Duty", "name_ar": "كول أوف ديوتي", "size_gb": 72.5, ...}
     */
    public function update(Request $request, string $id)
    {
        $game = Game::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255', 'unique:games,name_en,' . $id],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255', 'unique:games,name_ar,' . $id],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'platform_id' => ['sometimes', 'required', 'exists:platforms,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'size_gb' => ['sometimes', 'required', 'numeric'],
            'downloads' => ['nullable', 'integer', 'min:0'],
            'date_release' => ['nullable', 'date'],
            'active' => ['nullable', 'boolean'],
        ]);

        $game->update($data);

        return $game;
    }

    public function toggleActive(Request $request, string $id)
    {
        $game = Game::findOrFail($id);

        $data = $request->validate([
            'active' => ['required', 'boolean'],
        ]);

        $game->update($data);

        return $game;
    }

    /**
     * Delete a game
     *
     * Remove a game entry. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The game ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(string $id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return response()->json(null, 204);
    }
}
