<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StorageDevice;

class StorageDevicesTableSeeder extends Seeder
{
    public function run(): void
    {
        // Create 20 sample storage devices
        StorageDevice::factory()->count(20)->create();
    }
}