<?php

namespace App\Http\Controllers;

use App\Models\StorageDeviceType;
use Illuminate\Http\Request;

/**
 * @group Storage Device Types
 * 
 * APIs for managing storage device types (CD-ROM, DVD-ROM, USB Stick, HDD, SSD, M.2)
 */
class StorageDeviceTypeController extends Controller
{
    /**
     * List all storage device types
     * 
     * Retrieve a list of all available storage device types with their names and descriptions in both English and Arabic.
     * 
     * @response 200 scenario="Success" {
     *     "data": [
     *         {
     *             "id": 1,
     *             "name_en": "USB Stick",
     *             "name_ar": "فلاش ميموري",
     *             "description_en": "Universal Serial Bus flash drive - Portable solid-state storage",
     *             "description_ar": "محرك أقراص فلاش USB - تخزين صلبة محمولة",
     *             "created_at": "2026-06-26T20:00:00.000000Z",
     *             "updated_at": "2026-06-26T20:00:00.000000Z"
     *         }
     *     ]
     * }
     */
    public function index()
    {
        $types = StorageDeviceType::all();
        return response()->json(['data' => $types]);
    }

    /**
     * Get a specific storage device type
     * 
     * Retrieve detailed information about a specific storage device type by ID.
     * 
     * @urlParam id int required The ID of the storage device type. Example: 1
     * 
     * @response 200 scenario="Success" {
     *     "data": {
     *         "id": 1,
     *         "name_en": "USB Stick",
     *         "name_ar": "فلاش ميموري",
     *         "description_en": "Universal Serial Bus flash drive - Portable solid-state storage",
     *         "description_ar": "محرك أقراص فلاش USB - تخزين صلبة محمولة",
     *         "created_at": "2026-06-26T20:00:00.000000Z",
     *         "updated_at": "2026-06-26T20:00:00.000000Z"
     *     }
     * }
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDeviceType] 999"
     * }
     */
    public function show($id)
    {
        $type = StorageDeviceType::findOrFail($id);
        return response()->json(['data' => $type]);
    }

    /**
     * Create a new storage device type
     * 
     * Create a new storage device type with bilingual names and descriptions.
     * 
     * @bodyParam name_en string required The English name of the device type. Example: USB Stick
     * @bodyParam name_ar string required The Arabic name of the device type. Example: فلاش ميموري
     * @bodyParam description_en string nullable The English description. Example: Portable solid-state storage
     * @bodyParam description_ar string nullable The Arabic description. Example: تخزين صلبة محمولة
     * 
     * @response 201 scenario="Success" {
     *     "data": {
     *         "id": 7,
     *         "name_en": "USB Stick",
     *         "name_ar": "فلاش ميموري",
     *         "description_en": "Portable solid-state storage",
     *         "description_ar": "تخزين صلبة محمولة",
     *         "created_at": "2026-06-26T20:00:00.000000Z",
     *         "updated_at": "2026-06-26T20:00:00.000000Z"
     *     }
     * }
     * 
     * @response 422 scenario="Validation Error" {
     *     "message": "The given data was invalid.",
     *     "errors": {
     *         "name_en": ["The name en field is required."]
     *     }
     * }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
        ]);

        $type = StorageDeviceType::create($validated);
        return response()->json(['data' => $type], 201);
    }

    /**
     * Update a storage device type
     * 
     * Update the information of an existing storage device type.
     * 
     * @urlParam id int required The ID of the storage device type. Example: 1
     * @bodyParam name_en string required The English name. Example: USB Stick
     * @bodyParam name_ar string required The Arabic name. Example: فلاش ميموري
     * @bodyParam description_en string nullable The English description.
     * @bodyParam description_ar string nullable The Arabic description.
     * 
     * @response 200 scenario="Success" {
     *     "data": {
     *         "id": 1,
     *         "name_en": "USB Stick",
     *         "name_ar": "فلاش ميموري",
     *         "updated_at": "2026-06-26T20:05:00.000000Z"
     *     }
     * }
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDeviceType] 999"
     * }
     */
    public function update(Request $request, $id)
    {
        $type = StorageDeviceType::findOrFail($id);
        
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
        ]);

        $type->update($validated);
        return response()->json(['data' => $type]);
    }

    /**
     * Delete a storage device type
     * 
     * Permanently delete a storage device type from the database.
     * 
     * @urlParam id int required The ID of the storage device type. Example: 1
     * 
     * @response 204 scenario="Success"
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDeviceType] 999"
     * }
     * 
     * @response 409 scenario="Conflict" {
     *     "message": "Cannot delete storage device type because it has associated devices."
     * }
     */
    public function destroy($id)
    {
        $type = StorageDeviceType::findOrFail($id);
        
        if ($type->devices()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete storage device type because it has associated devices.'
            ], 409);
        }

        $type->delete();
        return response()->json(null, 204);
    }
}