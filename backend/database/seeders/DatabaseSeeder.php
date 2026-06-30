<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CategoriesTableSeeder;
use Database\Seeders\GovernoratesTableSeeder;
use Database\Seeders\CustomersTableSeeder;
use Database\Seeders\GamesTableSeeder;
use Database\Seeders\ProgramsTableSeeder;
use Database\Seeders\UsbSticksTableSeeder;
use Database\Seeders\AdminSettingsTableSeeder;
use Database\Seeders\PackageCategoryTypesTableSeeder;
use Database\Seeders\PackagesTableSeeder;
use Database\Seeders\StorageDeviceTypesTableSeeder;
use Database\Seeders\StorageDevicesTableSeeder;
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

        $this->call(CategoriesTableSeeder::class);
        $this->call(PlatformsTableSeeder::class);
        $this->call(GamesTableSeeder::class);
        $this->call(ProgramsTableSeeder::class);
        $this->call(GovernoratesTableSeeder::class);
        $this->call(CustomersTableSeeder::class);
        $this->call(UsbSticksTableSeeder::class);
        $this->call(StorageDeviceTypesTableSeeder::class);
        $this->call(StorageDevicesTableSeeder::class);
        $this->call(PackageCategoryTypesTableSeeder::class);
        $this->call(PackagesTableSeeder::class);
        $this->call(AdminSettingsTableSeeder::class);
    }
}
