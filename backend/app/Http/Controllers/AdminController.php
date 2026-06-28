<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PackageOrder;
use App\Models\Package;
use App\Models\UsbStickOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'data' => [
                'total_packages' => Package::count(),
                'total_orders' => PackageOrder::count() + UsbStickOrder::count(),
                'total_users' => User::count(),
                'total_revenue' => (float) PackageOrder::where('status', 'delivered')->sum('total_price') + (float) UsbStickOrder::where('status', 'delivered')->sum('total_price'),
            ]
        ]);
    }

    public function orders()
    {
        $orders = PackageOrder::with('customer')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $orders]);
    }

    public function packageOrders()
    {
        $orders = PackageOrder::with(['customer', 'items.package.items.itemable', 'governorate'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    public function usbStickOrders()
    {
        $orders = UsbStickOrder::with(['customer', 'usbStick'])->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $orders]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = PackageOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['message' => 'Status updated']);
    }

    public function updatePackageOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = PackageOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['message' => 'Status updated']);
    }

    public function updateUsbStickOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = UsbStickOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['message' => 'Status updated']);
    }

    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $users]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|string|in:client,admin']);
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);
        return response()->json(['message' => 'Role updated']);
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:client,admin',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|required|string|in:client,admin',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->noContent();
    }

    public function settings()
    {
        $settings = DB::table('site_settings')->first();
        return response()->json(['data' => $settings]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'locale' => 'sometimes|string',
            'theme' => 'sometimes|string',
            'min_password_length' => 'sometimes|integer|min:4|max:100',
        ]);

        $data = $request->only(['locale', 'theme', 'min_password_length']);

        $existing = DB::table('site_settings')->first();
        if ($existing) {
            DB::table('site_settings')->where('id', $existing->id)->update($data);
        } else {
            DB::table('site_settings')->insert($data);
        }

        return response()->json(['message' => 'Settings saved']);
    }
}
