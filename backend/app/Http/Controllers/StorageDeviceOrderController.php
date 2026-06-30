<?php

namespace App\Http\Controllers;

use App\Models\StorageDeviceOrder;
use App\Models\StorageDevice;
use App\Models\Game;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @group Storage Device Orders
 * 
 * APIs for managing storage device orders
 */
class StorageDeviceOrderController extends Controller
{
    private function resolveCustomer(Request $request)
    {
        return $request->user('sanctum')
            ?? Auth::guard('sanctum')->user()
            ?? Auth::user();
    }

    public function index()
    {
        $customer = $this->resolveCustomer(request());
        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $orders = $customer->storageDeviceOrders()->with(['storageDevice', 'items.itemable'])->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $customer = $this->resolveCustomer($request);
        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $data = $request->validate([
            'storage_device_id' => 'required|exists:storage_devices,id',
            'quantity' => 'required|integer|min:1',
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
            'program_ids' => 'nullable|array',
            'program_ids.*' => 'exists:programs,id',
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'required|string',
            'phone' => 'required|string',
        ]);

        if (empty($data['game_ids'] ?? []) && empty($data['program_ids'] ?? [])) {
            return response()->json(['message' => 'At least one game or program is required.'], 422);
        }

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

        foreach (($data['game_ids'] ?? []) as $gameId) {
            $order->items()->create([
                'itemable_type' => Game::class,
                'itemable_id' => $gameId,
            ]);
        }

        foreach (($data['program_ids'] ?? []) as $programId) {
            $order->items()->create([
                'itemable_type' => Program::class,
                'itemable_id' => $programId,
            ]);
        }

        $order->load(['storageDevice', 'items.itemable']);

        return response()->json($order, 201);
    }

    public function show(StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = $this->resolveCustomer(request());
        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        if ($storageDeviceOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $storageDeviceOrder->load(['storageDevice', 'items.itemable']);

        return response()->json($storageDeviceOrder);
    }

    public function update(Request $request, StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = $this->resolveCustomer($request);
        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

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
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
            'program_ids' => 'nullable|array',
            'program_ids.*' => 'exists:programs,id',
        ]);

        $storageDeviceOrder->update($data);

        if ($request->has('game_ids') || $request->has('program_ids')) {
            $storageDeviceOrder->items()->delete();

            foreach (($data['game_ids'] ?? []) as $gameId) {
                $storageDeviceOrder->items()->create([
                    'itemable_type' => Game::class,
                    'itemable_id' => $gameId,
                ]);
            }

            foreach (($data['program_ids'] ?? []) as $programId) {
                $storageDeviceOrder->items()->create([
                    'itemable_type' => Program::class,
                    'itemable_id' => $programId,
                ]);
            }
        }

        $storageDeviceOrder->load(['storageDevice', 'items.itemable']);

        return response()->json($storageDeviceOrder);
    }

    public function destroy(StorageDeviceOrder $storageDeviceOrder)
    {
        $customer = $this->resolveCustomer(request());
        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        if ($storageDeviceOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $storageDeviceOrder->delete();

        return response()->noContent();
    }
}
