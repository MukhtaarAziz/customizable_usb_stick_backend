<?php

namespace Database\Factories;

use App\Models\Platform;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlatformFactory extends Factory
{
    protected $model = Platform::class;

    public function definition()
    {
        return [
            'name_en' => $this->faker->unique()->word(),
            'name_ar' => $this->faker->unique()->word(),
            'description_en' => $this->faker->sentence(),
            'description_ar' => $this->faker->sentence(),
        ];
    }
}
