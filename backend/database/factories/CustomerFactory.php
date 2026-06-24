<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Governorate;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition()
    {
        $servicePoints = [
            'Baghdad Central',
            'Basra Port',
            'Erbil Downtown',
            'Mosul Hub',
            'Najaf Terminal',
            'Karbala Center',
        ];

        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->unique()->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'governorate_id' => Governorate::inRandomOrder()->first()->id ?? 1,
            'address' => $this->faker->address(),
            'nearest_service_point' => $this->faker->randomElement($servicePoints),
        ];
    }
}
