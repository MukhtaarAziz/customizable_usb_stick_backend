<?php

namespace App\Http\Controllers;

use App\Models\UsbStick;
use Illuminate\Http\Request;

/**
 * @group USB Sticks
 *
 * Manage available USB stick models.
 */
class UsbStickController extends Controller
{
    /**
     * List USB sticks
     *
     * Get a list of available USB stick models.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @responseField id int USB stick ID.
     * @responseField name_en string English name.
     * @responseField name_ar string Arabic name.
     * @responseField size_gb float Storage capacity in GB.
     * @responseField interface string Connection interface (e.g. USB 3.0).
     * @responseField price_iqd float Price in Iraqi Dinar.
     */
    public function index()
    {
        return response()->json(UsbStick::all());
    }

    /**
     * Show a USB stick
     *
     * Get details of a single USB stick model.
     *
     * @subgroup Public
     * @unauthenticated
     *
     * @urlParam usb_stick int required The USB stick ID. Example: 1
     *
     * @response {"id": 1, "name_en": "32GB USB 3.0", "name_ar": "32 جيجا USB 3.0", "size_gb": 32, "interface": "USB 3.0", "price_iqd": 15000}
     */
    public function show(UsbStick $usbStick)
    {
        return response()->json($usbStick);
    }

    /**
     * Create a USB stick
     *
     * Add a new USB stick model. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @bodyParam name_en string required English name. Example: 64GB USB 3.1
     * @bodyParam name_ar string required Arabic name. Example: 64 جيجا USB 3.1
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam size_gb numeric required Storage capacity in GB. Example: 64
     * @bodyParam interface string required Connection interface. Example: USB 3.1
     * @bodyParam price_iqd numeric Price in Iraqi Dinar. Example: 25000
     *
     * @response status=201 {"id": 2, "name_en": "64GB USB 3.1", "name_ar": "64 جيجا USB 3.1", "size_gb": 64, "interface": "USB 3.1", "price_iqd": 25000}
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'size_gb' => 'required|numeric',
            'interface' => 'required|string',
            'price_iqd' => 'nullable|numeric|min:0',
        ]);

        $usb = UsbStick::create($data);
        return response()->json($usb, 201);
    }

    /**
     * Update a USB stick
     *
     * Update an existing USB stick model. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam usb_stick int required The USB stick ID. Example: 1
     *
     * @bodyParam name_en string English name.
     * @bodyParam name_ar string Arabic name.
     * @bodyParam description_en string English description.
     * @bodyParam description_ar string Arabic description.
     * @bodyParam size_gb numeric Storage capacity in GB.
     * @bodyParam interface string Connection interface.
     * @bodyParam price_iqd numeric Price in Iraqi Dinar.
     *
     * @response {"id": 1, "name_en": "32GB USB 3.0", "name_ar": "32 جيجا USB 3.0", "size_gb": 32, "interface": "USB 3.0", "price_iqd": 15000}
     */
    public function update(Request $request, UsbStick $usbStick)
    {
        $data = $request->validate([
            'name_en' => 'sometimes|required|string',
            'name_ar' => 'sometimes|required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'size_gb' => 'sometimes|required|numeric',
            'interface' => 'sometimes|required|string',
            'price_iqd' => 'nullable|numeric|min:0',
        ]);

        $usbStick->update($data);
        return response()->json($usbStick);
    }

    /**
     * Delete a USB stick
     *
     * Remove a USB stick model. Admin only.
     *
     * @subgroup Admin
     * @authenticated
     *
     * @urlParam usb_stick int required The USB stick ID. Example: 1
     *
     * @response status=204
     */
    public function destroy(UsbStick $usbStick)
    {
        $usbStick->delete();
        return response()->noContent();
    }
}
