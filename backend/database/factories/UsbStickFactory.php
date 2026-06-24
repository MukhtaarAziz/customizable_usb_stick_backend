<?php

namespace Database\Factories;

use App\Models\UsbStick;
use Illuminate\Database\Eloquent\Factories\Factory;

class UsbStickFactory extends Factory
{
    protected $model = UsbStick::class;

    public function definition()
    {
        $sizes = [0.5, 1, 2, 4, 8];
        $interfaces = ['2.0', '3.0', '3.1', '3.2'];

        return [
            'name_en' => $this->faker->unique()->word() . ' USB',
            'name_ar' => $this->faker->unique()->word() . ' USB',
            'description_en' => $this->faker->sentence(),
            'description_ar' => $this->faker->sentence(),
            'size_gb' => $this->faker->randomElement($sizes),
            'interface' => $this->faker->randomElement($interfaces),
        ];
    }
}
