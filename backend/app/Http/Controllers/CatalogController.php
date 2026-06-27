<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Game;
use App\Models\Platform;
use App\Models\Program;
use Illuminate\Http\Request;

/**
 * @group Catalog
 * 
 * APIs for browsing games and programs catalog
 */
class CatalogController extends Controller
{
    /**
     * List catalog items
     * 
     * Retrieve a paginated list of games and/or programs with filtering options.
     * 
     * @queryParam per_page int Number of items per page (max 100). Example: 15
     * @queryParam page int Page number. Example: 1
     * @queryParam type string Filter by type: 'all', 'game', or 'program'. Example: all
     * @queryParam search string Search by name or tags. Example: action
     * @queryParam category_id int Filter by category ID. Example: 1
     * @queryParam platform_id int Filter by platform ID. Example: 2
     * 
     * @response 200 scenario="Success" {
     *     "data": [
     *         {
     *             "id": 1,
     *             "name_en": "Game Name",
     *             "name_ar": "اسم اللعبة",
     *             "type": "game",
     *             "category": {
     *                 "id": 1,
     *                 "name_en": "Action"
     *             },
     *             "platform": {
     *                 "id": 1,
     *                 "name_en": "PlayStation"
     *             }
     *         }
     *     ],
     *     "meta": {
     *         "current_page": 1,
     *         "last_page": 5,
     *         "per_page": 15,
     *         "total": 75
     *     }
     * }
     */
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $type = $request->query('type', 'all');
        $search = $request->query('search');
        $categoryId = $request->query('category_id');

        // Determine which types to query based on category type if category is selected
        $queryTypes = [];
        if ($categoryId) {
            $category = Category::find($categoryId);
            if ($category) {
                // If category is game type (1), only query games
                // If category is program type (2), only query programs
                $queryTypes = $category->category_type_id === 1 ? ['game'] : ['program'];
            }
        } else {
            // No category filter, use the type parameter
            $queryTypes = in_array($type, ['all', 'game', 'program']) ? [$type === 'all' ? 'game' : $type] : ['game'];
            if ($type === 'all') {
                $queryTypes = ['game', 'program'];
            }
        }

        $items = collect();

        if (in_array('game', $queryTypes)) {
            $query = Game::with(['category', 'platform', 'images']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_ar', 'like', "%{$search}%")
                        ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            if ($platformId = $request->query('platform_id')) {
                $query->where('platform_id', $platformId);
            }

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            $query->orderBy('name_en');

            $games = $query->get()->map(function ($game) {
                $data = $game->toArray();
                $data['type'] = 'game';
                return $data;
            });

            $items = $items->concat($games);
        }

        if (in_array('program', $queryTypes)) {
            $query = Program::with(['category', 'platform', 'images']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_ar', 'like', "%{$search}%")
                        ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            if ($platformId = $request->query('platform_id')) {
                $query->where('platform_id', $platformId);
            }

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            $query->orderBy('name_en');

            $programs = $query->get()->map(function ($program) {
                $data = $program->toArray();
                $data['type'] = 'program';
                return $data;
            });

            $items = $items->concat($programs);
        }

        $items = $items->sortBy('name_en')->values();

        $total = $items->count();
        $page = (int) $request->query('page', 1);
        $itemsForPage = $items->forPage($page, $perPage)->values();

        return response()->json([
            'data' => $itemsForPage,
            'meta' => [
                'current_page' => $page,
                'last_page' => max((int) ceil($total / $perPage), 1),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    /**
     * List all categories
     * 
     * Retrieve a list of all available categories with bilingual names.
     * 
     * @response 200 scenario="Success" [
     *     {
     *         "id": 1,
     *         "name_en": "Action",
     *         "name_ar": "أكشن",
     *         "description_en": "Action games",
     *         "description_ar": "ألعاب أكشن",
     *         "category_type_id": 1
     *     },
     *     {
     *         "id": 2,
     *         "name_en": "Sports",
     *         "name_ar": "رياضة",
     *         "description_en": "Sports games",
     *         "description_ar": "ألعاب رياضية",
     *         "category_type_id": 1
     *     }
     * ]
     */
    public function categories()
    {
        $categories = Category::all()->map(function ($category) {
            return [
                'id' => $category->id,
                'name_en' => $category->name_en,
                'name_ar' => $category->name_ar,
                'description_en' => $category->description_en,
                'description_ar' => $category->description_ar,
                'category_type_id' => $category->category_type_id,
            ];
        });

        return response()->json($categories);
    }

    /**
     * List game platforms
     * 
     * Retrieve a list of all available game platforms.
     * 
     * @response 200 scenario="Success" [
     *     {
     *         "id": 1,
     *         "name_en": "PlayStation 4",
     *         "name_ar": "بلاي ستيشن 4",
     *         "created_at": "2026-06-26T20:00:00.000000Z",
     *         "updated_at": "2026-06-26T20:00:00.000000Z"
     *     },
     *     {
     *         "id": 2,
     *         "name_en": "Xbox One",
     *         "name_ar": "إكس بوكس ون",
     *         "created_at": "2026-06-26T20:00:00.000000Z",
     *         "updated_at": "2026-06-26T20:00:00.000000Z"
     *     }
     * ]
     */
    public function gamePlatforms()
    {
        $platforms = Platform::all();

        return response()->json($platforms);
    }

    public function programPlatforms()
    {
        $platforms = Platform::all();

        return response()->json($platforms);
    }
}
