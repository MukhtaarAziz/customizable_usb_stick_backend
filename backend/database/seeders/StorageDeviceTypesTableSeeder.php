<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StorageDeviceType;

class StorageDeviceTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name_en' => 'CD-ROM',
                'name_ar' => 'سي دي روم',
                'description_en' => 'Compact Disc Read-Only Memory - Optical storage medium',
                'description_ar' => 'قرص مضغوط للقراءة فقط - وسيط تخزين بصري',
            ],
            [
                'name_en' => 'DVD-ROM',
                'name_ar' => 'دي في دي روم',
                'description_en' => 'Digital Versatile Disc Read-Only Memory - High capacity optical storage',
                'description_ar' => 'قرص رقمي متعدد الاستخدامات للقراءة فقط - تخزين بصري عالي السعة',
            ],
            [
                'name_en' => 'USB Stick',
                'name_ar' => 'فلاش ميموري',
                'description_en' => 'Universal Serial Bus flash drive - Portable solid-state storage',
                'description_ar' => 'محرك أقراص فلاش USB - تخزين صلبة محمولة',
            ],
            [
                'name_en' => 'HDD',
                'name_ar' => 'هارد ديسك',
                'description_en' => 'Hard Disk Drive - Traditional magnetic storage device',
                'description_ar' => 'محرك الأقراص الصلبة - جهاز تخزين مغناطيسي تقليدي',
            ],
            [
                'name_en' => 'SSD',
                'name_ar' => '固态 ديسك',
                'description_en' => 'Solid State Drive - Fast flash-based storage',
                'description_ar' => 'محرك الحالة الصلبة - تخزين سريع يعتمد على الفلاش',
            ],
            [
                'name_en' => 'M.2',
                'name_ar' => 'إم تو',
                'description_en' => 'M.2 NVMe - High-speed compact storage interface',
                'description_ar' => 'واجهة تخزين سريعة ومدمجة من نوع M.2',
            ],
        ];

        foreach ($types as $type) {
            StorageDeviceType::create($type);
        }
    }
}