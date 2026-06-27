<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\StorageDevice;
use App\Models\StorageDeviceType;

class StorageDeviceFactory extends Factory
{
    protected $model = StorageDevice::class;

    public function definition(): array
    {
        $storageType = StorageDeviceType::inRandomOrder()->first() ?? StorageDeviceType::factory()->create();
        
        $brands = ['SanDisk', 'Kingston', 'Samsung', 'Crucial', 'Western Digital', 'Seagate', 'Lexar', 'PNY'];
        $interfaces = ['USB 2.0', 'USB 3.0', 'USB 3.1', 'USB-C', 'SATA III', 'M.2 NVMe'];
        
        $sizeMB = fake()->randomElement([8192, 16384, 32768, 65536, 131072, 262144]); // 8GB to 256GB
        $realSizeMB = (int)($sizeMB * 0.93); // ~93% of advertised size
        
        $priceIQD = $this->getPriceBySize($sizeMB);

        return [
            'name_en' => fake()->randomElement($brands) . ' ' . $storageType->name_en . ' ' . $this->formatSize($sizeMB),
            'name_ar' => fake()->randomElement($brands) . ' ' . $storageType->name_ar . ' ' . $this->formatSize($sizeMB),
            'description_en' => fake()->sentence(15),
            'description_ar' => fake()->sentence(15),
            'storage_type_id' => $storageType->id,
            'size_mb' => $sizeMB,
            'real_size_mb' => $realSizeMB,
            'price_iqd' => $priceIQD,
            'marka' => fake()->randomElement($brands),
            'interface' => fake()->randomElement($interfaces),
        ];
    }

    private function getPriceBySize($sizeMB): float
    {
        // Approximate prices in IQD based on size
        $prices = [
            8192 => 15000,      // 8GB
            16384 => 25000,     // 16GB
            32768 => 45000,     // 32GB
            65536 => 80000,     // 64GB
            131072 => 150000,   // 128GB
            262144 => 280000,   // 256GB
        ];

        return $prices[$sizeMB] ?? 50000;
    }

    private function formatSize($sizeMB): string
    {
        $sizeGB = $sizeMB / 1024;
        return $sizeGB >= 1 ? "{$sizeGB}GB" : "{$sizeMB}MB";
    }
}