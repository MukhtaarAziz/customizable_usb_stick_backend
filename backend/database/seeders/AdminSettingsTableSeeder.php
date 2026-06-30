<?php

namespace Database\Seeders;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSettingsTableSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        if ($admin) {
            AdminSetting::firstOrCreate(
                ['user_id' => $admin->id],
                [
                    'language' => 'en',
                    'pagination_per_page' => 15,
                    'darkmode' => false,
                ]
            );
        }
    }
}
