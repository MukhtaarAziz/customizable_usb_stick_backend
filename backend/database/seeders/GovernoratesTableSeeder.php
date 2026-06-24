<?php

namespace Database\Seeders;

use App\Models\Governorate;
use Illuminate\Database\Seeder;

class GovernoratesTableSeeder extends Seeder
{
    public function run()
    {
        $governorates = [
            ['name_en' => 'Baghdad', 'name_ar' => 'بغداد'],
            ['name_en' => 'Al-Najaf', 'name_ar' => 'النجف'],
            ['name_en' => 'Karbala', 'name_ar' => 'كربلاء'],
            ['name_en' => 'Basra', 'name_ar' => 'البصرة'],
            ['name_en' => 'Al-Nasiriyah', 'name_ar' => 'الناصرية'],
            ['name_en' => 'Al-Diwaniyah', 'name_ar' => 'الديوانية'],
            ['name_en' => 'Kirkuk', 'name_ar' => 'كركوك'],
            ['name_en' => 'Mosul', 'name_ar' => 'الموصل'],
            ['name_en' => 'Erbil', 'name_ar' => 'أربيل'],
            ['name_en' => 'Duhok', 'name_ar' => 'دهوك'],
            ['name_en' => 'Sulaymaniyah', 'name_ar' => 'السليمانية'],
            ['name_en' => 'Al-Muthanna', 'name_ar' => 'المثنى'],
            ['name_en' => 'Wasit', 'name_ar' => 'واسط'],
            ['name_en' => 'Al-Qadisiyyah', 'name_ar' => 'القادسية'],
            ['name_en' => 'Al-Anbar', 'name_ar' => 'الأنبار'],
            ['name_en' => 'Maysan', 'name_ar' => 'ميسان'],
            ['name_en' => 'Salah Ad-Din', 'name_ar' => 'صلاح الدين'],
            ['name_en' => 'Babylon', 'name_ar' => 'بابل'],
        ];

        foreach ($governorates as $governorate) {
            Governorate::firstOrCreate($governorate);
        }
    }
}
