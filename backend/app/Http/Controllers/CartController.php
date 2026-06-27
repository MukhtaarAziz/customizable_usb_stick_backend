<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function show()
    {
        $customer = Auth::user();

        if (!$customer) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = $customer->cart()->with(['items.package'])->first();

        if (!$cart) {
            return response()->json(['items' => []]);
        }

        return response()->json($cart);
    }

    public function sync(Request $request)
    {
        $customer = Auth::user();

        if (!$customer) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'items' => 'required|array',
            'items.*.package_id' => 'required|exists:packages,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $customer->cart()->firstOrCreate(['customer_id' => $customer->id]);

        $cart->items()->delete();

        foreach ($data['items'] as $itemData) {
            $cart->items()->create([
                'package_id' => $itemData['package_id'],
                'quantity' => (int) $itemData['quantity'],
            ]);
        }

        $cart->load(['items.package']);

        return response()->json($cart);
    }

    public function destroy()
    {
        $customer = Auth::user();

        if (!$customer) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = $customer->cart()->first();

        if ($cart) {
            $cart->items()->delete();
            $cart->delete();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}
