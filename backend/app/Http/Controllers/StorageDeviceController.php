<?php

namespace App\Http\Controllers;

use App\Models\StorageDevice;
use App\Models\StorageDeviceType;
use Illuminate\Http\Request;

/**
 * @group Storage Devices
 * 
 * APIs for managing physical storage devices (USB sticks, HDDs, SSDs, etc.)
 */
class StorageDeviceController extends Controller
{
    /**
     * List all storage devices
     * 
     * Retrieve a paginated list of all storage devices with their type information.
     * 
     * @queryParam per_page int Number of items per page. Example: 15
     * @queryParam page int Page number. Example: 1
     * @queryParam storage_type_id int Filter by storage device type ID. Example: 3
     * @queryParam search string Search by device name. Example: SanDisk
     * 
     * @response 200 scenario="Success" {
     *     "data": [
     *         {
     *             "id": 1,
     *             "name_en": "SanDisk USB Stick 16GB",
     *             "name_ar": "سان ديسك فلاش ميموري 16GB",
     *             "description_en": "High-speed portable storage device",
     *             "description_ar": "جهاز تخزين محمول عالي السرعة",
     *             "storage_type_id": 3,
     *             "size_mb": 16384,
     *             "real_size_mb": 15234,
     *             "price_iqd": 25000.00,
     *             "marka": "SanDisk",
     *             "interface": "USB 3.0",
     *             "created_at": "2026-06-26T20:00:00.000000Z",
     *             "updated_at": "2026-06-26T20:00:00.000000Z",
     *             "storage_type": {
     *                 "id": 3,
     *                 "name_en": "USB Stick",
     *                 "name_ar": "فلاش ميموري"
     *             }
     *         }
     *     ],
     *     "meta": {
     *         "current_page": 1,
     *         "last_page": 5,
     *         "per_page": 15,
     *         "total": 20
     *     }
     * }
     */
    public function index(Request $request)
    {
        $query = StorageDevice::with('storageType');
        
        if ($request->has('storage_type_id')) {
            $query->where('storage_type_id', $request->storage_type_id);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('marka', 'like', "%{$search}%");
            });
        }
        
        $perPage = $request->input('per_page', 15);
        $devices = $query->paginate($perPage);
        
        return response()->json([
            'data' => $devices->items(),
            'meta' => [
                'current_page' => $devices->currentPage(),
                'last_page' => $devices->lastPage(),
                'per_page' => $devices->perPage(),
                'total' => $devices->total(),
            ]
        ]);
    }

    /**
     * Get a specific storage device
     * 
     * Retrieve detailed information about a specific storage device by ID.
     * 
     * @urlParam id int required The ID of the storage device. Example: 1
     * 
     * @response 200 scenario="Success" {
     *     "data": {
     *         "id": 1,
     *         "name_en": "SanDisk USB Stick 16GB",
     *         "name_ar": "سان ديسك فلاش ميموري 16GB",
     *         "description_en": "High-speed portable storage device",
     *         "description_ar": "جهاز تخزين محمول عالي السرعة",
     *         "storage_type_id": 3,
     *         "size_mb": 16384,
     *         "real_size_mb": 15234,
     *         "price_iqd": 25000.00,
     *         "marka": "SanDisk",
     *         "interface": "USB 3.0",
     *         "created_at": "2026-06-26T20:00:00.000000Z",
     *         "updated_at": "2026-06-26T20:00:00.000000Z",
     *         "storage_type": {
     *             "id": 3,
     *             "name_en": "USB Stick",
     *             "name_ar": "فلاش ميموري"
     *         }
     *     }
     * }
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDevice] 999"
     * }
     */
    public function show($id)
    {
        $device = StorageDevice::with('storageType')->findOrFail($id);
        return response()->json(['data' => $device]);
    }

    /**
     * Create a new storage device
     * 
     * Create a new storage device with all required information.
     * 
     * @bodyParam name_en string required The English name. Example: SanDisk USB Stick 16GB
     * @bodyParam name_ar string required The Arabic name. Example: سان ديسك فلاش ميموري 16GB
     * @bodyParam description_en string nullable The English description. Example: High-speed portable storage
     * @bodyParam description_ar string nullable The Arabic description. Example: جهاز تخزين محمول عالي السرعة
     * @bodyParam storage_type_id int required The storage device type ID. Example: 3
     * @bodyParam size_mb int required The advertised size in MB. Example: 16384
     * @bodyParam real_size_mb int nullable The actual usable size in MB. Example: 15234
     * @bodyParam price_iqd numeric required The price in Iraqi Dinar. Example: 25000.00
     * @bodyParam marka string required The brand name. Example: SanDisk
     * @bodyParam interface string required The interface type. Example: USB 3.0
     * 
     * @response 201 scenario="Success" {
     *     "data": {
     *         "id": 21,
     *         "name_en": "SanDisk USB Stick 16GB",
     *         "name_ar": "سان ديسك فلاش ميموري 16GB",
     *         "description_en": "High-speed portable storage",
     *         "description_ar": "جهاز تخزين محمول عالي السرعة",
     *         "storage_type_id": 3,
     *         "size_mb": 16384,
     *         "real_size_mb": 15234,
     *         "price_iqd": 25000.00,
     *         "marka": "SanDisk",
     *         "interface": "USB 3.0",
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
            'storage_type_id' => 'required|exists:storage_device_types,id',
            'size_mb' => 'required|integer|min:1',
            'real_size_mb' => 'nullable|integer|min:1',
            'price_iqd' => 'required|numeric|min:0',
            'marka' => 'required|string|max:255',
            'interface' => 'required|string|max:255',
        ]);

        $device = StorageDevice::create($validated);
        $device->load('storageType');
        
        return response()->json(['data' => $device], 201);
    }

    /**
     * Update a storage device
     * 
     * Update the information of an existing storage device.
     * 
     * @urlParam id int required The ID of the storage device. Example: 1
     * @bodyParam name_en string required The English name. Example: SanDisk USB Stick 16GB
     * @bodyParam name_ar string required The Arabic name. Example: سان ديسك فلاش ميموري 16GB
     * @bodyParam description_en string nullable The English description.
     * @bodyParam description_ar string nullable The Arabic description.
     * @bodyParam storage_type_id int required The storage device type ID. Example: 3
     * @bodyParam size_mb int required The advertised size in MB. Example: 16384
     * @bodyParam real_size_mb int nullable The actual usable size in MB.
     * @bodyParam price_iqd numeric required The price in Iraqi Dinar. Example: 25000.00
     * @bodyParam marka string required The brand name. Example: SanDisk
     * @bodyParam interface string required The interface type. Example: USB 3.0
     * 
     * @response 200 scenario="Success" {
     *     "data": {
     *         "id": 1,
     *         "name_en": "SanDisk USB Stick 16GB",
     *         "name_ar": "سان ديسك فلاش ميموري 16GB",
     *         "price_iqd": 27000.00,
     *         "updated_at": "2026-06-26T20:05:00.000000Z"
     *     }
     * }
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDevice] 999"
     * }
     */
    public function update(Request $request, $id)
    {
        $device = StorageDevice::findOrFail($id);
        
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'storage_type_id' => 'required|exists:storage_device_types,id',
            'size_mb' => 'required|integer|min:1',
            'real_size_mb' => 'nullable|integer|min:1',
            'price_iqd' => 'required|numeric|min:0',
            'marka' => 'required|string|max:255',
            'interface' => 'required|string|max:255',
        ]);

        $device->update($validated);
        $device->load('storageType');
        
        return response()->json(['data' => $device]);
    }

    /**
     * Delete a storage device
     * 
     * Permanently delete a storage device from the database.
     * 
     * @urlParam id int required The ID of the storage device. Example: 1
     * 
     * @response 204 scenario="Success"
     * 
     * @response 404 scenario="Not Found" {
     *     "message": "No query results for model [App\\Models\\StorageDevice] 999"
     * }
     * 
     * @response 409 scenario="Conflict" {
     *     "message": "Cannot delete storage device because it is used in orders."
     * }
     */
    public function destroy($id)
    {
        $device = StorageDevice::findOrFail($id);
        
        // Check if device is used in any orders
        if ($device->orders()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete storage device because it is used in orders.'
            ], 409);
        }

        $device->delete();
        return response()->json(null, 204);
    }
}