<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Governorate;
use Illuminate\Database\Seeder;

class CustomersTableSeeder extends Seeder
{
    public function run(): void
    {
        Customer::query()->delete();

        $governorateId = Governorate::query()->value('id') ?? 1;

        $customers = [
            [
                'name' => 'أحمد',
                'phone' => '07701234567',
                'email' => 'ahmed@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'بغداد، الأعظمية',
                'nearest_service_point' => 'Baghdad Central',
            ],
            [
                'name' => 'علي',
                'phone' => '07801234567',
                'email' => 'ali@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'البصرة، الميناء',
                'nearest_service_point' => 'Basra Port',
            ],
            [
                'name' => 'أحمد علي',
                'phone' => '07501234567',
                'email' => 'ahmedali@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'أربيل، وسط المدينة',
                'nearest_service_point' => 'Erbil Downtown',
            ],
            [
                'name' => 'علي محمد',
                'phone' => '07901234567',
                'email' => 'alimohammed@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'الموصل، القادسية',
                'nearest_service_point' => 'Mosul Hub',
            ],
            [
                'name' => 'أحمد حسين',
                'phone' => '07711234567',
                'email' => 'ahmedhussein@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'النجف، الكوفة',
                'nearest_service_point' => 'Najaf Terminal',
            ],
            [
                'name' => 'علي حسن',
                'phone' => '07811234567',
                'email' => 'alihassan@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'كربلاء، المدينة',
                'nearest_service_point' => 'Karbala Center',
            ],
            [
                'name' => 'أحمد يوسف',
                'phone' => '07511234567',
                'email' => 'ahmedyoussef@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'بغداد، الصدر',
                'nearest_service_point' => 'Baghdad Central',
            ],
            [
                'name' => 'علي رعد',
                'phone' => '07911234567',
                'email' => 'aliraad@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'البصرة، الزبير',
                'nearest_service_point' => 'Basra Port',
            ],
            [
                'name' => 'أحمد ناصر',
                'phone' => '07721234567',
                'email' => 'ahmednasser@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'النجف، المشخاب',
                'nearest_service_point' => 'Najaf Terminal',
            ],
            [
                'name' => 'علي كريم',
                'phone' => '07821234567',
                'email' => 'alikarim@example.com',
                'password' => bcrypt('password123'),
                'governorate_id' => $governorateId,
                'address' => 'أربيل، الرواندز',
                'nearest_service_point' => 'Erbil Downtown',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
