<?php

namespace App\Http\Controllers;

use App\Models\PackageCategoryType;
use Illuminate\Http\Request;

/**
 * @group Package Category Types
 *
 * Manage package category types (e.g., games, programs, mixed).
 */
class PackageCategoryTypeController extends Controller
{
    /**
     * List package category types
     *
     * Get a paginated list of all package category types.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @queryParam per_page int Results per page (1-100). Defaults to 15. Example: 15
     *
     * @responseField data[].id int Package category type ID.
     * @responseField data[].name_en string English name.
     * @responseField data[].name_ar string Arabic name.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = PackageCategoryType::withCount('packages');

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->appends($request->query());
    }

    /**
     * Create a package category type
     *
     * Add a new package category type. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @bodyParam name_en string required English name. Example: Games
     * @bodyParam name_ar string required Arabic name. Example: ألعاب
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     *
     * @response status=201 {"id": 1, "name_en": "Games", "name_ar": "ألعاب", ...}
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:package_category_types,name_en'],
            'name_ar' => ['required', 'string', 'max:255', 'unique:package_category_types,name_ar'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        return PackageCategoryType::create($data);
    }

    /**
     * Show a package category type
     *
     * Get details of a single package category type by ID.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam id int required The package category type ID. Example: 1
     *
     * @response {"id": 1, "name_en": "Games", "name_ar": "ألعاب", ...}
     */
    public function show(string $id)
    {
        return PackageCategoryType::findOrFail($id);
    }

    /**
     * Update a package category type
     *
     * Update an existing package category type. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The package category type ID. Example: 1
     *
     * @bodyParam name_en string English name.
     * @bodyParam name_ar string Arabic name.
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     *
     * @response {"id": 1, "name_en": "Games", "name_ar": "ألعاب", ...}
     */
    public function update(Request $request, string $id)
    {
        $packageCategoryType = PackageCategoryType::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255', 'unique:package_category_types,name_en,' . $id],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255', 'unique:package_category_types,name_ar,' . $id],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
        ]);

        $packageCategoryType->update($data);

        return $packageCategoryType;
    }

    /**
     * Delete a package category type
     *
     * Remove a package category type. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The package category type ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(string $id)
    {
        $packageCategoryType = PackageCategoryType::findOrFail($id);
        $packageCategoryType->delete();
        return response()->json(['message' => 'Package category type deleted successfully.'], 200);
    }
}
