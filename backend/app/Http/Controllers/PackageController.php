<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

/**
 * @group Packages
 *
 * Manage packages that bundle games and programs.
 */
class PackageController extends Controller
{
    /**
     * List packages
     *
     * Get a paginated list of packages, filterable by search, platform, and category type.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @queryParam per_page int Results per page (1-100). Defaults to 15. Example: 15
     * @queryParam search string Search by English or Arabic name. Example: gaming
     * @queryParam platform_id int Filter by platform ID. Example: 1
     * @queryParam package_category_type_id int Filter by package category type ID. Example: 1
     *
     * @responseField data[].id int Package ID.
     * @responseField data[].name_en string English name.
     * @responseField data[].name_ar string Arabic name.
     * @responseField data[].platform object The platform.
     * @responseField data[].package_category_type object The category type.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Package::with(['platform', 'packageCategoryType', 'storageDevice', 'items.itemable']);

        if (!$request->query('show_all')) {
            $query->where('active', true);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        if ($platformId = $request->query('platform_id')) {
            $query->where('platform_id', $platformId);
        }

        if ($active = $request->query('active')) {
            $query->where('active', $active === 'true' || $active === '1');
        }

        if ($categoryTypeId = $request->query('package_category_type_id')) {
            $query->where('package_category_type_id', $categoryTypeId);
        }

        return $query
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->appends($request->query());
    }

    /**
     * Create a package
     *
     * Add a new package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @bodyParam name_en string required English name. Example: Gaming Pack 1
     * @bodyParam name_ar string required Arabic name. Example: حزمة ألعاب ١
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam platform_id int required Platform ID. Example: 1
     * @bodyParam package_category_type_id int required Package category type ID. Example: 1
     *
     * @response status=201 {"id": 1, "name_en": "Gaming Pack 1", "name_ar": "حزمة ألعاب ١", ...}
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:packages,name_en'],
            'name_ar' => ['required', 'string', 'max:255', 'unique:packages,name_ar'],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'platform_id' => ['required', 'exists:platforms,id'],
            'package_category_type_id' => ['required', 'exists:package_category_types,id'],
            'storage_device_id' => ['nullable', 'exists:storage_devices,id'],
            'price_iqd' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'active' => ['nullable', 'boolean'],
        ]);

        $data['price_iqd'] ??= 0;
        $data['discount'] ??= 0;
        $data['active'] ??= true;

        return Package::create($data);
    }

    /**
     * Show a package
     *
     * Get details of a single package by ID with its platform, category type, and items.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam id int required The package ID. Example: 1
     *
     * @response {"id": 1, "name_en": "Gaming Pack 1", "name_ar": "حزمة ألعاب ١", "platform": {...}, "package_category_type": {...}, "items": [...]}
     */
    public function show(string $id)
    {
        return Package::with(['platform', 'packageCategoryType', 'storageDevice', 'items.itemable'])->findOrFail($id);
    }

    /**
     * Update a package
     *
     * Update an existing package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The package ID. Example: 1
     *
     * @bodyParam name_en string English name.
     * @bodyParam name_ar string Arabic name.
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam platform_id int Platform ID.
     * @bodyParam package_category_type_id int Package category type ID.
     *
     * @response {"id": 1, "name_en": "Gaming Pack 1", "name_ar": "حزمة ألعاب ١", ...}
     */
    public function update(Request $request, string $id)
    {
        $package = Package::findOrFail($id);

        $data = $request->validate([
            'name_en' => ['sometimes', 'required', 'string', 'max:255', 'unique:packages,name_en,' . $id],
            'name_ar' => ['sometimes', 'required', 'string', 'max:255', 'unique:packages,name_ar,' . $id],
            'description_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'platform_id' => ['sometimes', 'required', 'exists:platforms,id'],
            'package_category_type_id' => ['sometimes', 'required', 'exists:package_category_types,id'],
            'storage_device_id' => ['nullable', 'exists:storage_devices,id'],
            'price_iqd' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'active' => ['nullable', 'boolean'],
        ]);

        $package->update($data);

        return $package->load(['platform', 'packageCategoryType', 'storageDevice', 'items.itemable']);
    }

    /**
     * Delete a package
     *
     * Remove a package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The package ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(string $id)
    {
        $package = Package::findOrFail($id);
        $package->delete();

        return response()->json(null, 204);
    }
}
