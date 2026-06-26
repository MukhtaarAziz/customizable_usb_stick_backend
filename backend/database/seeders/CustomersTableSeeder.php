<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomersTableSeeder extends Seeder
{
    public function run()
    {
        // create 10 customers with seeded data
        Customer::factory()->count(10)->create();
    }
}
