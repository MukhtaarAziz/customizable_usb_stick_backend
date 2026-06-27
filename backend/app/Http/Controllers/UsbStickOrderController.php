<?php

namespace App\Http\Controllers;

use App\Models\UsbStickOrder;
use App\Models\UsbStick;
use App\Models\Game;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsbStickOrderController extends Controller
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
        if (! $customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $orders = $customer->usbStickOrders()->with(['usbStick', 'items.itemable'])->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        try {
            $customer = $this->resolveCustomer($request);

            if (!$customer) {
                return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
            }

            $data = $request->validate([
                'usb_stick_id' => 'required|exists:usb_sticks,id',
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
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Validation failed',
                'error' => $e->getMessage()
            ], 422);
        }

        $usbStick = UsbStick::findOrFail($data['usb_stick_id']);
        $totalPrice = $usbStick->price_iqd ?? 0;

        $order = UsbStickOrder::create([
            'customer_id' => $customer->id,
            'usb_stick_id' => $data['usb_stick_id'],
            'total_price' => $totalPrice,
            'status' => UsbStickOrder::STATUS_PENDING,
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

        $order->load(['usbStick', 'items.itemable']);

        return response()->json($order, 201);
    }

    public function show(UsbStickOrder $usbStickOrder)
    {
        $customer = $this->resolveCustomer(request());

        if (! $customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        if ($usbStickOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $usbStickOrder->load(['usbStick', 'items.itemable']);

        return response()->json($usbStickOrder);
    }

    public function update(Request $request, UsbStickOrder $usbStickOrder)
    {
        $customer = $this->resolveCustomer($request);

        if (! $customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        if ($usbStickOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'notes' => 'nullable|string',
            'custom_message' => 'nullable|string',
            'delivery_address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'status' => 'sometimes|in:' . implode(',', [
                UsbStickOrder::STATUS_PENDING,
                UsbStickOrder::STATUS_PROCESSING,
                UsbStickOrder::STATUS_SHIPPED,
                UsbStickOrder::STATUS_DELIVERED,
                UsbStickOrder::STATUS_CANCELLED,
            ]),
            'game_ids' => 'nullable|array',
            'game_ids.*' => 'exists:games,id',
            'program_ids' => 'nullable|array',
            'program_ids.*' => 'exists:programs,id',
        ]);

        $usbStickOrder->update($data);

        if ($request->has('game_ids') || $request->has('program_ids')) {
            $usbStickOrder->items()->delete();

            foreach (($data['game_ids'] ?? []) as $gameId) {
                $usbStickOrder->items()->create([
                    'itemable_type' => Game::class,
                    'itemable_id' => $gameId,
                ]);
            }

            foreach (($data['program_ids'] ?? []) as $programId) {
                $usbStickOrder->items()->create([
                    'itemable_type' => Program::class,
                    'itemable_id' => $programId,
                ]);
            }
        }

        $usbStickOrder->load(['usbStick', 'items.itemable']);

        return response()->json($usbStickOrder);
    }

    public function destroy(UsbStickOrder $usbStickOrder)
    {
        $customer = $this->resolveCustomer(request());

        if (! $customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        if ($usbStickOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $usbStickOrder->delete();

        return response()->noContent();
    }
}
