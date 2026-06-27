<?php

namespace App\Http\Controllers;

use App\Models\StorageDeviceOrder;
use App\Models\StorageDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Storage Device Orders
 * 
 * APIs for managing storage device orders
 */
class StorageDeviceOrderController extends Controller
{
    public function index()
    {
        $customer = Auth::user();
        $orders = $customer->storageDeviceOrders()->with('storageDevice')->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'storage_device_id' => 'required|exists:storage_devices,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'required|string',
            'phone' => 'required|string',
        ]);

        $customer = Auth::user();
        $device = StorageDevice::findOrFail($data['storage_device_id']);
        $unitPrice = $device->price_iqd ?? 0;
        $totalPrice = $unitPrice * $data['quantity'];

        $order = StorageDeviceOrder::create([
            'customer_id' => $customer->id,
            'storage_device_id' => $data['storage_device_id'],
            'quantity' => $data['quantity'],
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'status' => StorageDeviceOrder::STATUS_PENDING,
            'notes' => $data['notes'] ?? null,
            'custom_message' => $data['custom_message'] ?? null,
            'delivery_address' => $data['delivery_address'],
            'phone' => $data['phone'],
        ]);

        $order->load('storageDevice');

        return response()->json($order, 201);
    }

    public function show(StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = Auth::user();

        if ($storageDeviceOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $storageDeviceOrder->load('storageDevice');

        return response()->json($storageDeviceOrder);
    }

    public function update(Request $request, StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = Auth::user();

        if ($storageDeviceOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'quantity' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|in:' . implode(',', [
                StorageDeviceOrder::STATUS_PENDING,
                StorageDeviceOrder::STATUS_PROCESSING,
                StorageDeviceOrder::STATUS_SHIPPED,
                StorageDeviceOrder::STATUS_DELIVERED,
                StorageDeviceOrder::STATUS_CANCELLED,
            ]),
        ]);

        $storageDeviceOrder->update($data);
        $storageDeviceOrder->load('storageDevice');

        return response()->json($storageDeviceOrder);
    }

    public function destroy(StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = Auth::user();

        if ($storageDeviceOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $storageDeviceOrder->delete();

        return response()->noContent();
    }
}