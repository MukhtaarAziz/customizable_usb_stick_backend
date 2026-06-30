<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminSettingController extends Controller
{
    public function index(Request $request)
    {
        $settings = AdminSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'language' => 'en',
                'pagination_per_page' => 15,
                'darkmode' => false,
            ]
        );

        return response()->json(['data' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'language' => ['sometimes', 'string', Rule::in(['en', 'ar'])],
            'pagination_per_page' => 'sometimes|integer|min:5|max:100',
            'darkmode' => 'sometimes|boolean',
        ]);

        $settings = AdminSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'language' => 'en',
                'pagination_per_page' => 15,
                'darkmode' => false,
            ]
        );

        $settings->update($data);

        return response()->json(['data' => $settings, 'message' => 'Settings saved']);
    }
}
