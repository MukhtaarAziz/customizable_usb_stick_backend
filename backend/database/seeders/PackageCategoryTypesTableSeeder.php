<?php

namespace Database\Seeders;

use App\Models\PackageCategoryType;
use Illuminate\Database\Seeder;

class PackageCategoryTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name_en' => 'Games',
                'name_ar' => 'ألعاب',
                'description_en' => 'Game packages',
                'description_ar' => 'باقات الألعاب',
            ],
            [
                'name_en' => 'Programs',
                'name_ar' => 'برامج',
                'description_en' => 'Program packages',
                'description_ar' => 'باقات البرامج',
            ],
            [
                'name_en' => 'Mixed',
                'name_ar' => 'مختلط',
                'description_en' => 'Mixed packages containing both games and programs',
                'description_ar' => 'باقات مختلطة تحتوي على ألعاب وبرامج',
            ],
        ];

        foreach ($types as $type) {
            PackageCategoryType::create($type);
        }
    }
}
