<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Governorate;
use App\Rules\IraqiPhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(Customer::with('governorate')->get());
    }

    public function show(Customer $customer)
    {
        return response()->json($customer->load('governorate'));
    }

    public function store(Request $request)
    {
        $governorateIds = Governorate::pluck('id')->toArray();
        
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => ['required', 'string', 'unique:customers,phone', new IraqiPhoneNumber()],
            'email' => 'nullable|email|unique:customers,email',
            'password' => ['required', 'string', 'min:8', 'regex:/^\S+$/'],
            'governorate_id' => 'required|integer|in:' . implode(',', $governorateIds),
            'address' => 'nullable|string',
            'nearest_service_point' => 'nullable|string|max:255',
        ]);

        $data['password'] = Hash::make($data['password']);
        $customer = Customer::create($data);
        return response()->json($customer->load('governorate'), 201);
    }

    public function update(Request $request, Customer $customer)
    {
        $governorateIds = Governorate::pluck('id')->toArray();
        
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => ['sometimes', 'required', 'string', 'unique:customers,phone,' . $customer->id, new IraqiPhoneNumber()],
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'governorate_id' => 'sometimes|required|integer|in:' . implode(',', $governorateIds),
            'address' => 'nullable|string',
            'nearest_service_point' => 'nullable|string|max:255',
        ]);

        $customer->update($data);
        return response()->json($customer->load('governorate'));
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->noContent();
    }

    public function governorates()
    {
        return response()->json(Governorate::all());
    }
}
