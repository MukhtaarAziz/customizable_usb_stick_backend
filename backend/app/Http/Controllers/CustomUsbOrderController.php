<?php

namespace App\Http\Controllers;

use App\Models\CustomUsbOrder;
use App\Models\Game;
use App\Models\UsbStick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomUsbOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customer = Auth::user();
        $orders = $customer->customUsbOrders()->with(['usbStick', 'games'])->get();
        
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $customer = Auth::user();
        
        $data = $request->validate([
            'usb_stick_id' => 'required|exists:usb_sticks,id',
            'game_ids' => 'required|array|min:1',
            'game_ids.*' => 'exists:games,id',
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'required|string',
            'phone' => 'required|string',
        ]);

        // Calculate total price
        $usbStick = UsbStick::findOrFail($data['usb_stick_id']);
        $totalPrice = $usbStick->price_iqd ?? 0;

        // Create the order
        $order = CustomUsbOrder::create([
            'customer_id' => $customer->id,
            'usb_stick_id' => $data['usb_stick_id'],
            'total_price' => $totalPrice,
            'status' => CustomUsbOrder::STATUS_PENDING,
            'notes' => $data['notes'] ?? null,
            'custom_message' => $data['custom_message'] ?? null,
            'delivery_address' => $data['delivery_address'],
            'phone' => $data['phone'],
        ]);

        // Attach games to the order
        $order->games()->attach($data['game_ids']);

        // Load relationships for response
        $order->load(['usbStick', 'games']);

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomUsbOrder $customUsbOrder)
    {
        $customer = Auth::user();
        
        // Ensure the order belongs to the authenticated customer
        if ($customUsbOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customUsbOrder->load(['usbStick', 'games']);

        return response()->json($customUsbOrder);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomUsbOrder $customUsbOrder)
    {
        $customer = Auth::user();
        
        // Ensure the order belongs to the authenticated customer
        if ($customUsbOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'status' => 'sometimes|in:' . implode(',', [
                CustomUsbOrder::STATUS_PENDING,
                CustomUsbOrder::STATUS_PROCESSING,
                CustomUsbOrder::STATUS_SHIPPED,
                CustomUsbOrder::STATUS_DELIVERED,
                CustomUsbOrder::STATUS_CANCELLED,
            ]),
        ]);

        $customUsbOrder->update($data);

        // Update games if provided
        if ($request->has('game_ids')) {
            $request->validate([
                'game_ids' => 'array|min:1',
                'game_ids.*' => 'exists:games,id',
            ]);
            $customUsbOrder->games()->sync($request->game_ids);
        }

        $customUsbOrder->load(['usbStick', 'games']);

        return response()->json($customUsbOrder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomUsbOrder $customUsbOrder)
    {
        $customer = Auth::user();
        
        // Ensure the order belongs to the authenticated customer
        if ($customUsbOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customUsbOrder->delete();

        return response()->noContent();
    }
}