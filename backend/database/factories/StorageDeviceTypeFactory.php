<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\StorageDeviceType;

class StorageDeviceTypeFactory extends Factory
{
    protected $model = StorageDeviceType::class;

    public function definition(): array
    {
        $types = [
            ['en' => 'CD-ROM', 'ar' => 'سي دي روم'],
            ['en' => 'DVD-ROM', 'ar' => 'دي في دي روم'],
            ['en' => 'USB Stick', 'ar' => 'فلاش ميموري'],
            ['en' => 'HDD', 'ar' => 'هارد ديسك'],
            ['en' => 'SSD', 'ar' => '固态 ديسك'],
            ['en' => 'M.2', 'ar' => 'إم تو'],
        ];

        $type = $types[array_rand($types)];

        return [
            'name_en' => $type['en'],
            'name_ar' => $type['ar'],
            'description_en' => fake()->sentence(10),
            'description_ar' => fake()->sentence(10),
        ];
    }
}