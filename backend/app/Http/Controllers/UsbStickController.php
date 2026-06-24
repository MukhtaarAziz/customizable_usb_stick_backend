<?php

namespace App\Http\Controllers;

use App\Models\UsbStick;
use Illuminate\Http\Request;

class UsbStickController extends Controller
{
    public function index()
    {
        return response()->json(UsbStick::all());
    }

    public function show(UsbStick $usbStick)
    {
        return response()->json($usbStick);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => 'required|string',
            'name_ar' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'size_gb' => 'required|numeric',
            'interface' => 'required|string',
        ]);

        $usb = UsbStick::create($data);
        return response()->json($usb, 201);
    }

    public function update(Request $request, UsbStick $usbStick)
    {
        $data = $request->validate([
            'name_en' => 'sometimes|required|string',
            'name_ar' => 'sometimes|required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'size_gb' => 'sometimes|required|numeric',
            'interface' => 'sometimes|required|string',
        ]);

        $usbStick->update($data);
        return response()->json($usbStick);
    }

    public function destroy(UsbStick $usbStick)
    {
        $usbStick->delete();
        return response()->noContent();
    }
}
