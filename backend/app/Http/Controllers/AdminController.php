<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use App\Models\Game;
use App\Models\Package;
use App\Models\PackageOrder;
use App\Models\Program;
use App\Models\StorageDeviceOrder;
use App\Models\StorageDeviceType;
use App\Models\UsbStickOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'data' => [
                'total_packages' => Package::count(),
                'total_orders' => PackageOrder::count() + UsbStickOrder::count() + StorageDeviceOrder::count(),
                'total_package_orders' => PackageOrder::count(),
                'total_users' => User::count(),
                'total_customers' => Customer::count(),
                'total_games' => Game::count(),
                'total_programs' => Program::count(),
                'total_storage_device_types' => StorageDeviceType::count(),
                'total_revenue' => (float) PackageOrder::where('status', 'delivered')->sum('total_price') + (float) UsbStickOrder::where('status', 'delivered')->sum('total_price') + (float) StorageDeviceOrder::where('status', 'delivered')->sum('total_price'),
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
        $orders = PackageOrder::with(['customer', 'items.package.items.itemable', 'governorate', 'statuses'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    public function usbStickOrders()
    {
        $orders = UsbStickOrder::with(['customer', 'usbStick', 'statuses'])->orderBy('created_at', 'desc')->get();
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
        $statuses = PackageOrder::STATUSES;
        $request->validate(['status' => ['required', 'string', Rule::in(array_keys($statuses))]]);
        $order = PackageOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        $order->statuses()->create(['status' => $request->status]);
        return response()->json(['message' => 'Status updated']);
    }

    public function updateUsbStickOrderStatus(Request $request, $id)
    {
        $statuses = UsbStickOrder::STATUSES;
        $request->validate(['status' => ['required', 'string', Rule::in(array_keys($statuses))]]);
        $order = UsbStickOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        $order->statuses()->create(['status' => $request->status]);
        return response()->json(['message' => 'Status updated']);
    }

    /**
     * List storage device orders
     *
     * Get all storage device orders with customer and device details. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @responseField data array List of storage device orders.
     * @responseField data[].id int Order ID.
     * @responseField data[].customer object The customer who placed the order.
     * @responseField data[].storage_device object The ordered storage device.
     * @responseField data[].games array Games included in the order.
     * @responseField data[].programs array Programs included in the order.
     * @responseField data[].quantity int Quantity ordered.
     * @responseField data[].unit_price string Unit price in IQD.
     * @responseField data[].total_price string Total price in IQD.
     * @responseField data[].status string Order status.
     */
    public function storageDeviceOrders()
    {
        $orders = StorageDeviceOrder::with(['customer', 'storageDevice', 'items.itemable', 'statuses'])->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $orders]);
    }

    /**
     * Update storage device order status
     *
     * Update the status of a storage device order. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam id int required The order ID. Example: 1
     * @bodyParam status string required New status. Must be one of: pending, processing, shipped, delivered, cancelled. Example: processing
     *
     * @response {"message": "Status updated"}
     */
    public function updateStorageDeviceOrderStatus(Request $request, $id)
    {
        $statuses = StorageDeviceOrder::STATUSES;
        $request->validate([
            'status' => ['required', 'string', Rule::in(array_keys($statuses))],
        ]);
        $order = StorageDeviceOrder::findOrFail($id);
        $order->update(['status' => $request->status]);
        $order->statuses()->create(['status' => $request->status]);
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

}
