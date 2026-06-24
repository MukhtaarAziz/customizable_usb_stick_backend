<?php

namespace Database\Seeders;

use App\Models\UsbStick;
use Illuminate\Database\Seeder;

class UsbSticksTableSeeder extends Seeder
{
    public function run()
    {
        UsbStick::factory()->count(10)->create();
    }
}
