<?php

namespace App\Http\Controllers;

use App\Models\PackageOrder;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PackageOrderController extends Controller
{
    public function index()
    {
        $customer = Auth::user();
        $orders = $customer->packageOrders()->with(['items.package'])->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $customer = Auth::user();

        if (!$customer) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $data = $request->validate([
            'packages' => 'required|array|min:1',
            'packages.*.id' => 'required|exists:packages,id',
            'packages.*.quantity' => 'required|integer|min:1|max:10',
            'packages.*.notes' => 'nullable|string|max:500',
            'delivery_address' => 'required|string',
            'phone' => 'required|string',
        ]);

        $packageIds = collect($data['packages'])->pluck('id')->unique();
        $packageModels = Package::whereIn('id', $packageIds)->get()->keyBy('id');

        if ($packageModels->isEmpty()) {
            return response()->json(['message' => 'No valid packages found.'], 422);
        }

        $totalPrice = 0;

        $order = PackageOrder::create([
            'customer_id' => $customer->id,
            'customer_name' => $customer->name,
            'governorate_id' => $customer->governorate_id,
            'total_price' => 0,
            'status' => PackageOrder::STATUS_PENDING,
            'delivery_address' => $data['delivery_address'],
            'phone' => $data['phone'],
        ]);

        foreach ($data['packages'] as $pkgData) {
            $package = $packageModels->get($pkgData['id']);
            if (!$package) continue;

            $unitPrice = $package->final_price_iqd ?? $package->price_iqd ?? 0;
            $quantity = (int) $pkgData['quantity'];
            $lineTotal = $unitPrice * $quantity;
            $totalPrice += $lineTotal;

            $order->items()->create([
                'package_id' => $package->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'notes' => $pkgData['notes'] ?? null,
            ]);
        }

        $order->update(['total_price' => $totalPrice]);

        $order->load(['items.package']);

        return response()->json($order, 201);
    }

    public function show(PackageOrder $packageOrder)
    {
        $customer = Auth::user();

        if ($packageOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $packageOrder->load(['items.package']);

        return response()->json($packageOrder);
    }

    public function update(Request $request, PackageOrder $packageOrder)
    {
        $customer = Auth::user();

        if ($packageOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'delivery_address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'status' => 'sometimes|in:' . implode(',', [
                PackageOrder::STATUS_PENDING,
                PackageOrder::STATUS_PROCESSING,
                PackageOrder::STATUS_SHIPPED,
                PackageOrder::STATUS_DELIVERED,
                PackageOrder::STATUS_CANCELLED,
            ]),
        ]);

        $packageOrder->update($data);
        $packageOrder->load(['items.package']);

        return response()->json($packageOrder);
    }

    public function destroy(PackageOrder $packageOrder)
    {
        $customer = Auth::user();

        if ($packageOrder->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $packageOrder->delete();

        return response()->noContent();
    }
}
