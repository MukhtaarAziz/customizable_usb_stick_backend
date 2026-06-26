<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    /**
     * Display a listing of packages.
     */
    public function index(Request $request)
    {
        $query = Package::with(['cover', 'platform', 'games']);

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
            $query->where('platform_id', $request->integer('platform_id'));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        $packages = $query->paginate($perPage);

        return response()->json($packages);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'cover_id' => 'nullable|exists:images,id',
            'platform_id' => 'required|exists:platforms,id',
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
        ]);

        $package = Package::create([
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'cover_id' => $validated['cover_id'] ?? null,
            'platform_id' => $validated['platform_id'],
            'views' => 0,
            'order_count' => 0,
        ]);

        if (isset($validated['game_ids'])) {
            $package->games()->sync($validated['game_ids']);
        }

        return response()->json($package->load(['cover', 'platform', 'games']), 201);
    }

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        return response()->json($package->load(['cover', 'platform', 'games']));
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'cover_id' => 'nullable|exists:images,id',
            'platform_id' => 'sometimes|exists:platforms,id',
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
            'views' => 'nullable|integer|min:0',
            'order_count' => 'nullable|integer|min:0',
        ]);

        $package->update($validated);

        if (isset($validated['game_ids'])) {
            $package->games()->sync($validated['game_ids']);
        }

        return response()->json($package->load(['cover', 'platform', 'games']));
    }

    /**
     * Remove the specified package.
     */
    public function destroy(Package $package)
    {
        $package->delete();
        return response()->noContent();
    }

    /**
     * Increment views count.
     */
    public function incrementViews(Package $package)
    {
        $package->increment('views');
        return response()->json(['views' => $package->views]);
    }

    /**
     * Increment order count.
     */
    public function incrementOrders(Package $package)
    {
        $package->increment('order_count');
        return response()->json(['order_count' => $package->order_count]);
    }
}
