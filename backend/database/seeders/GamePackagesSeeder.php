<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Package;
use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GamePackagesSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pcPlatform = Platform::where('name_en', 'PC')->first();
        $ps5Platform = Platform::where('name_en', 'PS5')->first();
        $ps4Platform = Platform::where('name_en', 'PS4')->first();
        $androidPlatform = Platform::where('name_en', 'Android')->first();

        if (!$pcPlatform || !$ps5Platform || !$ps4Platform || !$androidPlatform) {
            return;
        }

        $packages = [
            [
                'name_en' => 'Forza Motorsport Collection',
                'name_ar' => 'مجموعة فورزا موتورسبورت',
                'description_en' => 'Experience the ultimate racing simulation with Forza Motorsport titles featuring realistic graphics and hundreds of cars.',
                'description_ar' => 'اختبر محاكاة السباق القصوى مع ألعاب فورزا الواقعية ومئات السيارات.',
                'platform_id' => $ps5Platform->id,
            ],
            [
                'name_en' => 'Forza Horizon Bundle',
                'name_ar' => 'مجموعة فورزا هوريزون',
                'description_en' => 'Open-world racing adventure across beautiful landscapes with Forza Horizon games.',
                'description_ar' => 'مغامرة سباق في عالم مفتوح عبر مناظر خلابة مع ألعاب فورزا هوريزون.',
                'platform_id' => $ps4Platform->id,
            ],
            [
                'name_en' => 'Command and Conquer Remaster',
                'name_ar' => 'إعادة إصدار كوماند أند كونكر',
                'description_en' => 'Real-time strategy classic with improved graphics and new campaigns in the C&C universe.',
                'description_ar' => 'لعبة استراتيجية كلاسيكية في الوقت الفعلي برسومات محسَّنة وحملات جديدة.',
                'platform_id' => $pcPlatform->id,
            ],
            [
                'name_en' => 'FIFA 24 Sports Pack',
                'name_ar' => 'حزمة فيفا 24 الرياضية',
                'description_en' => 'Play as your favorite football teams and players in the ultimate soccer simulation.',
                'description_ar' => 'العب مع فريقك المفضل وأبطالك في محاكاة كرة القدم القصوى.',
                'platform_id' => $ps5Platform->id,
            ],
            [
                'name_en' => 'The Witcher 3 Ultimate Edition',
                'name_ar' => 'إصدار الساحر 3 النهائي',
                'description_en' => 'Epic RPG adventure with rich storytelling, magical spells, and monsters to hunt across vast open worlds.',
                'description_ar' => 'مغامرة RPG ملحمية برواية غنية وتعاويذ سحرية ووحوش للصيد في عوالم مفتوحة شاسعة.',
                'platform_id' => $ps4Platform->id,
            ],
            [
                'name_en' => 'Elden Ring Collection',
                'name_ar' => 'مجموعة الدن رينج',
                'description_en' => 'Dark fantasy RPG with challenging combat, mysterious lore, and beautiful yet dangerous worlds.',
                'description_ar' => 'لعبة RPG خيال مظلم بقتال محدٍ وسحر غامض وعوالم جميلة وخطرة.',
                'platform_id' => $ps5Platform->id,
            ],
            [
                'name_en' => 'Cyberpunk 2077 Enhanced',
                'name_ar' => 'سايبربانك 2077 محسَّنة',
                'description_en' => 'Immersive sci-fi RPG set in Night City with deep character customization and branching quests.',
                'description_ar' => 'لعبة RPG خيال علمي غامرة في مدينة الليل برسومات عميقة وسعي متشعب.',
                'platform_id' => $pcPlatform->id,
            ],
            [
                'name_en' => 'Gran Turismo 7 Racing Master',
                'name_ar' => 'ماستر سباق جران توريزمو 7',
                'description_en' => 'Premium racing simulator featuring legendary cars, iconic tracks, and online multiplayer.',
                'description_ar' => 'محاكي سباق فاخر بسيارات أسطورية وحلبات أيقونية ولاعبين متعددين على الإنترنت.',
                'platform_id' => $ps5Platform->id,
            ],
            [
                'name_en' => 'Genshin Impact Adventure Pack',
                'name_ar' => 'حزمة مغامرة جينشين إمباكت',
                'description_en' => 'Explore a magical world with beautiful visuals, strategic combat, and free-to-play adventure.',
                'description_ar' => 'استكشف عالماً سحرياً برسومات جميلة وقتال استراتيجي ومغامرة مجانية.',
                'platform_id' => $androidPlatform->id,
            ],
            [
                'name_en' => 'Starfield Exploration Bundle',
                'name_ar' => 'حزمة الاستكشاف في ستارفيلد',
                'description_en' => 'Massive space RPG with infinite worlds, alien encounters, and deep role-playing customization.',
                'description_ar' => 'لعبة RPG فضائية ضخمة بعوالم لا نهائية وحتقابلات غريبة وتخصيص لعب عميق.',
                'platform_id' => $pcPlatform->id,
            ],
        ];

        foreach ($packages as $packageData) {
            $package = Package::create([
                'name_en' => $packageData['name_en'],
                'name_ar' => $packageData['name_ar'],
                'description_en' => $packageData['description_en'],
                'description_ar' => $packageData['description_ar'],
                'cover_id' => null,
                'platform_id' => $packageData['platform_id'],
                'views' => rand(0, 500),
                'order_count' => rand(0, 100),
            ]);
        }
    }
}
