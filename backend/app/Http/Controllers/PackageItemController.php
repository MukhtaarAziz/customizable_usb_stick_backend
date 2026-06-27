<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Package;
use App\Models\PackageItem;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * @group Package Items
 *
 * Manage items (games/programs) within a package.
 */
class PackageItemController extends Controller
{
    /**
     * List package items
     *
     * Get all items in a specific package.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam package int required The package ID. Example: 1
     *
     * @responseField data[].id int Package item ID.
     * @responseField data[].itemable object The associated game or program.
     */
    public function index(string $packageId)
    {
        $package = Package::findOrFail($packageId);

        return $package->items()->with('itemable')->get();
    }

    /**
     * Add an item to a package
     *
     * Attach a game or program to a package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam package int required The package ID. Example: 1
     *
     * @bodyParam itemable_type string required The model type. Must be "App\Models\Game" or "App\Models\Program". Example: App\Models\Game
     * @bodyParam itemable_id int required The ID of the game or program. Example: 1
     *
     * @response status=201 {"id": 1, "package_id": 1, "itemable_type": "App\\Models\\Game", "itemable_id": 1, ...}
     */
    public function store(Request $request, string $packageId)
    {
        $package = Package::findOrFail($packageId);

        $data = $request->validate([
            'itemable_type' => ['required', 'string', Rule::in([Game::class, Program::class])],
            'itemable_id' => ['required', 'integer', 'min:1'],
        ]);

        $data['package_id'] = $package->id;

        return PackageItem::create($data);
    }

    /**
     * Show a package item
     *
     * Get details of a single item within a package.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam package int required The package ID. Example: 1
     * @urlParam item int required The package item ID. Example: 1
     *
     * @response {"id": 1, "package_id": 1, "itemable_type": "App\\Models\\Game", "itemable_id": 1, "itemable": {...}}
     */
    public function show(string $packageId, string $itemId)
    {
        $package = Package::findOrFail($packageId);

        return $package->items()->with('itemable')->findOrFail($itemId);
    }

    /**
     * Update a package item
     *
     * Update the item reference within a package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam package int required The package ID. Example: 1
     * @urlParam item int required The package item ID. Example: 1
     *
     * @bodyParam itemable_type string The model type. Must be "App\Models\Game" or "App\Models\Program".
     * @bodyParam itemable_id int The ID of the game or program.
     *
     * @response {"id": 1, "package_id": 1, "itemable_type": "App\\Models\\Game", "itemable_id": 2, ...}
     */
    public function update(Request $request, string $packageId, string $itemId)
    {
        $package = Package::findOrFail($packageId);

        $item = $package->items()->findOrFail($itemId);

        $data = $request->validate([
            'itemable_type' => ['sometimes', 'required', 'string', Rule::in([Game::class, Program::class])],
            'itemable_id' => ['sometimes', 'required', 'integer', 'min:1'],
        ]);

        $item->update($data);

        return $item;
    }

    /**
     * Remove an item from a package
     *
     * Detach a game or program from a package. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam package int required The package ID. Example: 1
     * @urlParam item int required The package item ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(string $packageId, string $itemId)
    {
        $package = Package::findOrFail($packageId);

        $item = $package->items()->findOrFail($itemId);
        $item->delete();

        return response()->json(null, 204);
    }
}
