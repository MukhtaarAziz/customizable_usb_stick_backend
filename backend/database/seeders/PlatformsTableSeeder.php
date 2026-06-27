<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformsTableSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = [
            ['name_en' => 'Xbox', 'name_ar' => 'إكس بوكس', 'description_en' => 'Microsoft Xbox console platform.', 'description_ar' => 'منصة جهاز إكس بوكس من مايكروسوفت.'],
            ['name_en' => 'Nintendo Switch', 'name_ar' => 'نينتندو سويتش', 'description_en' => 'Nintendo Switch console platform.', 'description_ar' => 'منصة جهاز نينتندو سويتش.'],
            ['name_en' => 'Android', 'name_ar' => 'أندرويد', 'description_en' => 'Android mobile platform.', 'description_ar' => 'منصة أندرويد المحمولة.'],
            ['name_en' => 'iOS', 'name_ar' => 'آي أو إس', 'description_en' => 'iOS mobile platform.', 'description_ar' => 'منصة آي أو إس المحمولة.'],
            ['name_en' => 'macOS', 'name_ar' => 'ماك أو إس', 'description_en' => 'Apple macOS operating system.', 'description_ar' => 'نظام تشغيل ماك أو إس من أبل.'],
            ['name_en' => 'Linux', 'name_ar' => 'لينكس', 'description_en' => 'Linux open-source operating system.', 'description_ar' => 'نظام تشغيل لينكس مفتوح المصدر.'],
            ['name_en' => 'PS1', 'name_ar' => 'بي إس 1', 'description_en' => 'Sony PlayStation 1 console.', 'description_ar' => 'جهاز بلاي ستيشن 1 من سوني.'],
            ['name_en' => 'PS2', 'name_ar' => 'بي إس 2', 'description_en' => 'Sony PlayStation 2 console.', 'description_ar' => 'جهاز بلاي ستيشن 2 من سوني.'],
            ['name_en' => 'PS3', 'name_ar' => 'بي إس 3', 'description_en' => 'Sony PlayStation 3 console.', 'description_ar' => 'جهاز بلاي ستيشن 3 من سوني.'],
            ['name_en' => 'PS4', 'name_ar' => 'بي إس 4', 'description_en' => 'Sony PlayStation 4 console.', 'description_ar' => 'جهاز بلاي ستيشن 4 من سوني.'],
            ['name_en' => 'PS5', 'name_ar' => 'بي إس 5', 'description_en' => 'Sony PlayStation 5 console.', 'description_ar' => 'جهاز بلاي ستيشن 5 من سوني.'],
            ['name_en' => 'PSP', 'name_ar' => 'بي إس بي', 'description_en' => 'Sony PlayStation Portable.', 'description_ar' => 'جهاز بلاي ستيشن المحمول من سوني.'],
            ['name_en' => 'PS Vita', 'name_ar' => 'بي إس فيتا', 'description_en' => 'Sony PlayStation Vita handheld console.', 'description_ar' => 'جهاز بلاي ستيشن فيتا المحمول من سوني.'],
            ['name_en' => 'Nintendo 3DS', 'name_ar' => 'نينتندو 3دي إس', 'description_en' => 'Nintendo 3DS handheld console.', 'description_ar' => 'جهاز نينتندو 3دي إس المحمول.'],
            ['name_en' => 'Wii', 'name_ar' => 'وي', 'description_en' => 'Nintendo Wii console.', 'description_ar' => 'جهاز وي من نينتندو.'],
            ['name_en' => 'Wii U', 'name_ar' => 'وي يو', 'description_en' => 'Nintendo Wii U console.', 'description_ar' => 'جهاز وي يو من نينتندو.'],
            ['name_en' => 'Dreamcast', 'name_ar' => 'دريم كاست', 'description_en' => 'Sega Dreamcast console.', 'description_ar' => 'جهاز دريم كاست من سيجا.'],
            ['name_en' => 'Windows', 'name_ar' => 'ويندوز', 'description_en' => 'Microsoft Windows operating system.', 'description_ar' => 'نظام تشغيل ويندوز من مايكروسوفت.'],
        ];

        Platform::insert($platforms);
    }
}
