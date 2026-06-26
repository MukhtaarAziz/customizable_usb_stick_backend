<?php

namespace App\Http\Controllers;

use App\Models\ProgramPackage;
use Illuminate\Http\Request;

class ProgramPackageController extends Controller
{
    public function index(Request $request)
    {
        $query = ProgramPackage::with(['cover', 'platform', 'programs']);

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
            $query->where('program_platform_id', $request->integer('platform_id'));
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
            'cover_id' => 'nullable|exists:program_images,id',
            'program_platform_id' => 'required|exists:program_platforms,id',
            'program_ids' => 'nullable|array',
            'program_ids.*' => 'exists:programs,id',
        ]);

        $programPackage = ProgramPackage::create([
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'],
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'cover_id' => $validated['cover_id'] ?? null,
            'program_platform_id' => $validated['program_platform_id'],
            'views' => 0,
            'order_count' => 0,
        ]);

        if (isset($validated['program_ids'])) {
            $programPackage->programs()->sync($validated['program_ids']);
        }

        return response()->json($programPackage->load(['cover', 'platform', 'programs']), 201);
    }

    public function show(ProgramPackage $programPackage)
    {
        return response()->json($programPackage->load(['cover', 'platform', 'programs']));
    }

    public function update(Request $request, ProgramPackage $programPackage)
    {
        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'cover_id' => 'nullable|exists:program_images,id',
            'program_platform_id' => 'sometimes|exists:program_platforms,id',
            'program_ids' => 'nullable|array',
            'program_ids.*' => 'exists:programs,id',
            'views' => 'nullable|integer|min:0',
            'order_count' => 'nullable|integer|min:0',
        ]);

        $programPackage->update($validated);

        if (isset($validated['program_ids'])) {
            $programPackage->programs()->sync($validated['program_ids']);
        }

        return response()->json($programPackage->load(['cover', 'platform', 'programs']));
    }

    public function destroy(ProgramPackage $programPackage)
    {
        $programPackage->delete();
        return response()->noContent();
    }

    public function incrementViews(ProgramPackage $programPackage)
    {
        $programPackage->increment('views');
        return response()->json(['views' => $programPackage->views]);
    }

    public function incrementOrders(ProgramPackage $programPackage)
    {
        $programPackage->increment('order_count');
        return response()->json(['order_count' => $programPackage->order_count]);
    }
}
