<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CategoryPlatformGameSeeder;
use Database\Seeders\GovernoratesTableSeeder;
use Database\Seeders\CustomersTableSeeder;
use Database\Seeders\PackagesTableSeeder;
use Database\Seeders\UsbSticksTableSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $this->call(CategoryPlatformGameSeeder::class);
        $this->call(PackagesTableSeeder::class);
        $this->call(GovernoratesTableSeeder::class);
        $this->call(CustomersTableSeeder::class);
        $this->call(UsbSticksTableSeeder::class);
    }
}
