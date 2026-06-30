<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Governorate;
use App\Rules\IraqiPhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @group Customers
 *
 * Manage customer accounts and governorates.
 */
class CustomerController extends Controller
{
    /**
     * List customers
     *
     * Get all registered customers with their governorates. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @responseField id int Customer ID.
     * @responseField name string Customer name.
     * @responseField phone string Phone number.
     * @responseField email string Email address.
     * @responseField governorate object The customer's governorate.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 15);
        return response()->json(Customer::with('governorate')->paginate($perPage));
    }

    /**
     * Show a customer
     *
     * Get details of a single customer. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam customer int required The customer ID. Example: 1
     *
     * @response {"id": 1, "name": "John Doe", "phone": "07701234567", "email": "john@example.com", "governorate": {...}}
     */
    public function show(Customer $customer)
    {
        return response()->json($customer->load('governorate'));
    }

    /**
     * Register a customer
     *
     * Create a new customer account. Public endpoint.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @bodyParam name string required Full name. Example: John Doe
     * @bodyParam phone string required Iraqi phone number (must be unique). Example: 07701234567
     * @bodyParam email string Email address (must be unique). Example: john@example.com
     * @bodyParam password string required Minimum 8 characters, no spaces. Example: secret123
     * @bodyParam governorate_id int required Governorate ID. Example: 1
     * @bodyParam address string Address details.
     * @bodyParam nearest_service_point string Nearest service point.
     *
     * @response status=201 {"id": 1, "name": "John Doe", "phone": "07701234567", "governorate": {...}}
     */
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

    /**
     * Update a customer
     *
     * Update an existing customer's information. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam customer int required The customer ID. Example: 1
     *
     * @bodyParam name string Full name.
     * @bodyParam phone string Iraqi phone number.
     * @bodyParam email string Email address.
     * @bodyParam governorate_id int Governorate ID.
     * @bodyParam address string Address details.
     * @bodyParam nearest_service_point string Nearest service point.
     *
     * @response {"id": 1, "name": "John Doe", "phone": "07701234567", "governorate": {...}}
     */
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

    /**
     * Delete a customer
     *
     * Remove a customer account. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam customer int required The customer ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->noContent();
    }

    /**
     * List governorates
     *
     * Get a list of all Iraqi governorates for address selection.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @responseField id int Governorate ID.
     * @responseField name_en string English name.
     * @responseField name_ar string Arabic name.
     *
     * @response [{"id": 1, "name_en": "Baghdad", "name_ar": "بغداد"}, ...]
     */
    public function governorates()
    {
        return response()->json(Governorate::all());
    }
}
