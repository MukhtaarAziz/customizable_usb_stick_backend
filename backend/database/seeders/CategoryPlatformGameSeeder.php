<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Game;
use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryPlatformGameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name_en' => 'Action', 'name_ar' => 'أكشن', 'description_en' => 'Fast paced action games.', 'description_ar' => 'ألعاب أكشن سريعة التفاعل.'],
            ['name_en' => 'Sport', 'name_ar' => 'رياضة', 'description_en' => 'Sports and athletic simulation games.', 'description_ar' => 'ألعاب رياضية ومحاكاة الأداء.'],
            ['name_en' => 'Racing', 'name_ar' => 'سباق', 'description_en' => 'High speed racing games.', 'description_ar' => 'ألعاب سباق بسرعات عالية.'],
            ['name_en' => 'RPG', 'name_ar' => 'RPG', 'description_en' => 'Role playing games with story and progression.', 'description_ar' => 'ألعاب تقمص الأدوار بقصة وتطور.'],
            ['name_en' => 'Indie', 'name_ar' => 'مستقلة', 'description_en' => 'Independent games from small studios.', 'description_ar' => 'ألعاب مستقلة من استوديوهات صغيرة.'],
        ];

        $platforms = [
            ['name_en' => 'PC', 'name_ar' => 'بي سي', 'description_en' => 'Personal computer platform.', 'description_ar' => 'منصة الحاسوب الشخصي.'],
            ['name_en' => 'PS1', 'name_ar' => 'بلاي ستيشن 1', 'description_en' => 'PlayStation 1 console.', 'description_ar' => 'جهاز بلاي ستيشن 1.'],
            ['name_en' => 'PS2', 'name_ar' => 'بلاي ستيشن 2', 'description_en' => 'PlayStation 2 console.', 'description_ar' => 'جهاز بلاي ستيشن 2.'],
            ['name_en' => 'PS3', 'name_ar' => 'بلاي ستيشن 3', 'description_en' => 'PlayStation 3 console.', 'description_ar' => 'جهاز بلاي ستيشن 3.'],
            ['name_en' => 'PS4', 'name_ar' => 'بلاي ستيشن 4', 'description_en' => 'PlayStation 4 console.', 'description_ar' => 'جهاز بلاي ستيشن 4.'],
            ['name_en' => 'PS5', 'name_ar' => 'بلاي ستيشن 5', 'description_en' => 'PlayStation 5 console.', 'description_ar' => 'جهاز بلاي ستيشن 5.'],
            ['name_en' => 'PSP', 'name_ar' => 'بي إس بي', 'description_en' => 'PlayStation Portable platform.', 'description_ar' => 'منصة بلاي ستيشن المحمولة.'],
            ['name_en' => 'Android', 'name_ar' => 'أندرويد', 'description_en' => 'Android mobile platform.', 'description_ar' => 'منصة أندرويد المحمولة.'],
            ['name_en' => 'IOS', 'name_ar' => 'آي أو إس', 'description_en' => 'iOS mobile platform.', 'description_ar' => 'منصة آي أو إس المحمولة.'],
        ];

        Category::insert($categories);
        Platform::insert($platforms);

        $actionCategory = Category::where('name_en', 'Action')->first();
        $racingCategory = Category::where('name_en', 'Racing')->first();
        $pcPlatform = Platform::where('name_en', 'PC')->first();
        $ps5Platform = Platform::where('name_en', 'PS5')->first();

        Game::create([
            'name_en' => 'Cyber Speed',
            'description_en' => 'A futuristic action racing game with fast cars and combat.',
            'name_ar' => 'سرعة سايبر',
            'description_ar' => 'لعبة سباق وأكشن مستقبلية بسيارات سريعة وقتال.',
            'category_id' => $actionCategory->id,
            'platform_id' => $pcPlatform->id,
            'tags' => ['action', 'racing', 'multiplayer'],
            'size_gb' => 1.5,
            'downloads' => 125000,
            'date_release' => '2024-11-15',
        ]);

        Game::create([
            'name_en' => 'Desert Racer',
            'description_en' => 'A thrilling racing experience across desert landscapes.',
            'name_ar' => 'سباق الصحراء',
            'description_ar' => 'تجربة سباق مثيرة عبر مناظر الصحراء.',
            'category_id' => $racingCategory->id,
            'platform_id' => $ps5Platform->id,
            'tags' => ['racing', 'singleplayer', 'simulation'],
            'size_gb' => 2.3,
            'downloads' => 89000,
            'date_release' => '2025-03-20',
        ]);
    }
}
