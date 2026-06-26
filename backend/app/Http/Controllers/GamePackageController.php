<?php

namespace App\Http\Controllers;

use App\Models\GamePackage;
use Illuminate\Http\Request;

class GamePackageController extends Controller
{
    public function index(Request $request)
    {
        $query = GamePackage::with(['cover', 'platform', 'games']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%")
                    ->orWhere('description_en', 'like', "%{$search}%")
                    ->orWhere('description_ar', 'like', "%{$search}%");
            });
        }

        if ($request->filled('platform_id')) {
            $query->where('game_platform_id', $request->integer('platform_id'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        $packages = $query->paginate($perPage);

        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'cover_id' => 'nullable|exists:game_images,id',
            'game_platform_id' => 'required|exists:game_platforms,id',
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
        ]);

        $gamePackage = GamePackage::create([
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'cover_id' => $validated['cover_id'] ?? null,
            'game_platform_id' => $validated['game_platform_id'],
            'views' => 0,
            'order_count' => 0,
        ]);

        if (isset($validated['game_ids'])) {
            $gamePackage->games()->sync($validated['game_ids']);
        }

        return response()->json($gamePackage->load(['cover', 'platform', 'games']), 201);
    }

    public function show(GamePackage $gamePackage)
    {
        return response()->json($gamePackage->load(['cover', 'platform', 'games']));
    }

    public function update(Request $request, GamePackage $gamePackage)
    {
        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'cover_id' => 'nullable|exists:game_images,id',
            'game_platform_id' => 'sometimes|exists:game_platforms,id',
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
            'views' => 'nullable|integer|min:0',
            'order_count' => 'nullable|integer|min:0',
        ]);

        $gamePackage->update($validated);

        if (isset($validated['game_ids'])) {
            $gamePackage->games()->sync($validated['game_ids']);
        }

        return response()->json($gamePackage->load(['cover', 'platform', 'games']));
    }

    public function destroy(GamePackage $gamePackage)
    {
        $gamePackage->delete();
        return response()->noContent();
    }

    public function incrementViews(GamePackage $gamePackage)
    {
        $gamePackage->increment('views');
        return response()->json(['views' => $gamePackage->views]);
    }

    public function incrementOrders(GamePackage $gamePackage)
    {
        $gamePackage->increment('order_count');
        return response()->json(['order_count' => $gamePackage->order_count]);
    }
}
