<?php

namespace Database\Seeders;

use App\Models\GameCategory;
use App\Models\Game;
use App\Models\GamePlatform;
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
            ['category_type_id' => 1, 'name_en' => 'Action', 'name_ar' => 'أكشن', 'description_en' => 'Fast paced action games.', 'description_ar' => 'ألعاب أكشن سريعة التفاعل.'],
            ['category_type_id' => 1, 'name_en' => 'Sport', 'name_ar' => 'رياضة', 'description_en' => 'Sports and athletic simulation games.', 'description_ar' => 'ألعاب رياضية ومحاكاة الأداء.'],
            ['category_type_id' => 1, 'name_en' => 'Racing', 'name_ar' => 'سباق', 'description_en' => 'High speed racing games.', 'description_ar' => 'ألعاب سباق بسرعات عالية.'],
            ['category_type_id' => 1, 'name_en' => 'RPG', 'name_ar' => 'RPG', 'description_en' => 'Role playing games with story and progression.', 'description_ar' => 'ألعاب تقمص الأدوار بقصة وتطور.'],
            ['category_type_id' => 1, 'name_en' => 'Indie', 'name_ar' => 'مستقلة', 'description_en' => 'Independent games from small studios.', 'description_ar' => 'ألعاب مستقلة من استوديوهات صغيرة.'],
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

        GameCategory::insert($categories);
        GamePlatform::insert($platforms);

        $actionCategory = GameCategory::where('name_en', 'Action')->first();
        $racingCategory = GameCategory::where('name_en', 'Racing')->first();
        $pcPlatform = GamePlatform::where('name_en', 'PC')->first();
        $ps5Platform = GamePlatform::where('name_en', 'PS5')->first();
        $ps4Platform = GamePlatform::where('name_en', 'PS4')->first();
        $androidPlatform = GamePlatform::where('name_en', 'Android')->first();

        $games = [
            [
                'name_en' => 'Need for Speed: Underground',
                'description_en' => 'Experience the underground racing scene with street cars and neon lights.',
                'name_ar' => 'نيد فور سبيد: تحت الأرض',
                'description_ar' => 'عش تجربة سباق الشوارع تحت الأرض مع سيارات الشارع وأضواء النيون.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['racing', 'street', 'arcade'],
                'size_gb' => 3.2,
                'downloads' => 120000,
                'date_release' => '2003-11-18',
            ],
            [
                'name_en' => 'Need for Speed: Most Wanted',
                'description_en' => 'High stakes police chases and exotic cars in a city full of rivals.',
                'name_ar' => 'نيد فور سبيد: الأكثر مطلوبة',
                'description_ar' => 'مطاردات شرطة عالية المخاطر وسيارات غريبة في مدينة مليئة بالمنافسين.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['racing', 'police', 'open world'],
                'size_gb' => 4.1,
                'downloads' => 175000,
                'date_release' => '2005-10-31',
            ],
            [
                'name_en' => 'Need for Speed: Heat',
                'description_en' => 'Daytime sanctioned races and nighttime illegal street runs.',
                'name_ar' => 'نيد فور سبيد: هيت',
                'description_ar' => 'سباقات مرخَّصة نهارًا وجولات شوارع غير قانونية ليلًا.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['racing', 'street', 'night'],
                'size_gb' => 5.5,
                'downloads' => 210000,
                'date_release' => '2019-11-08',
            ],
            [
                'name_en' => 'Need for Speed: Hot Pursuit',
                'description_en' => 'A classic race between cops and racers on scenic roads.',
                'name_ar' => 'نيد فور سبيد: المطاردة الساخنة',
                'description_ar' => 'سباق كلاسيكي بين الشرطة والمتسابقين على طرق خلابة.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['racing', 'police', 'action'],
                'size_gb' => 4.7,
                'downloads' => 190000,
                'date_release' => '2010-11-16',
            ],
            [
                'name_en' => 'Need for Speed: Unleashed',
                'description_en' => 'Tour global cities and take on racing challenges in street and off-road modes.',
                'name_ar' => 'نيد فور سبيد: أنليشد',
                'description_ar' => 'تجوّل في المدن العالمية وتحدَّ سباقات في وضعي الشارع والتضاريس.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['racing', 'street', 'off-road'],
                'size_gb' => 5.0,
                'downloads' => 160000,
                'date_release' => '2008-11-18',
            ],
            [
                'name_en' => 'Need for Speed: Carbon',
                'description_en' => 'Control night-time street races and crew rivalry in canyon runs.',
                'name_ar' => 'نيد فور سبيد: كاربون',
                'description_ar' => 'تحكم في سباقات الشوارع الليلية وتنافس الأطقم في المنعطفات الجبلية.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $pcPlatform->id,
                'tags' => ['racing', 'street', 'crew'],
                'size_gb' => 4.9,
                'downloads' => 150000,
                'date_release' => '2006-10-31',
            ],
            [
                'name_en' => 'Need for Speed: Rivals',
                'description_en' => 'Policed pursuit racing with a seamless open-world experience.',
                'name_ar' => 'نيد فور سبيد: ريفالز',
                'description_ar' => 'سباقات مع مطاردة الشرطة وباستخدام عالم مفتوح سلس.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $ps4Platform->id,
                'tags' => ['racing', 'open world', 'police'],
                'size_gb' => 6.2,
                'downloads' => 140000,
                'date_release' => '2013-11-19',
            ],
            [
                'name_en' => 'Need for Speed: No Limits',
                'description_en' => 'Street racing on your phone with fast cars and customization.',
                'name_ar' => 'نيد فور سبيد: نو ليمتس',
                'description_ar' => 'سباق شوارع على هاتفك مع سيارات سريعة وتخصيص واسع.',
                'category_id' => $racingCategory->id,
                'game_platform_id' => $androidPlatform->id,
                'tags' => ['racing', 'mobile', 'street'],
                'size_gb' => 1.0,
                'downloads' => 300000,
                'date_release' => '2015-09-30',
            ],
            [
                'name_en' => 'Call of Duty: Modern Warfare',
                'description_en' => 'A modern military shooter with cinematic missions and multiplayer action.',
                'name_ar' => 'كول أوف ديوتي: مودرن وارفير',
                'description_ar' => 'إطلاق نار عسكري حديث بمهمات سينمائية وأكشن متعدد اللاعبين.',
                'category_id' => $actionCategory->id,
                'game_platform_id' => $pcPlatform->id,
                'tags' => ['shooter', 'multiplayer', 'military'],
                'size_gb' => 10.5,
                'downloads' => 250000,
                'date_release' => '2019-10-25',
            ],
            [
                'name_en' => 'Call of Duty: Black Ops Cold War',
                'description_en' => 'Cold War era battles with explosive multiplayer warfare.',
                'name_ar' => 'كول أوف ديوتي: بلاك أوبس كولد وور',
                'description_ar' => 'معارك حقبة الحرب الباردة وحرب متعددة اللاعبين متفجرة.',
                'category_id' => $actionCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['shooter', 'multiplayer', 'historical'],
                'size_gb' => 11.8,
                'downloads' => 220000,
                'date_release' => '2020-11-13',
            ],
            [
                'name_en' => 'Call of Duty: Vanguard',
                'description_en' => 'World War II shooter with dynamic squad combat and campaigns.',
                'name_ar' => 'كول أوف ديوتي: فانغارد',
                'description_ar' => 'لعبة إطلاق نار من الحرب العالمية الثانية مع قتال فرقي ودورات ديناميكية.',
                'category_id' => $actionCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['shooter', 'historical', 'multiplayer'],
                'size_gb' => 12.0,
                'downloads' => 180000,
                'date_release' => '2021-11-05',
            ],
            [
                'name_en' => 'Call of Duty: Warzone',
                'description_en' => 'Free-to-play battle royale with large-scale combat and team play.',
                'name_ar' => 'كول أوف ديوتي: وورزون',
                'description_ar' => 'باتل رويال مجانية مع قتالات واسعة النطاق ولعب فرق.',
                'category_id' => $actionCategory->id,
                'game_platform_id' => $ps5Platform->id,
                'tags' => ['battle royale', 'shooter', 'team'],
                'size_gb' => 14.2,
                'downloads' => 500000,
                'date_release' => '2020-03-10',
            ],
            [
                'name_en' => 'Call of Duty: Mobile',
                'description_en' => 'A mobile shooter experience featuring classic maps, modes, and battle royale.',
                'name_ar' => 'كول أوف ديوتي: موبايل',
                'description_ar' => 'تجربة إطلاق نار على الهاتف تضم خرائط ووضعيات كلاسيكية وباتل رويال.',
                'category_id' => $actionCategory->id,
                'game_platform_id' => $androidPlatform->id,
                'tags' => ['mobile', 'shooter', 'battle royale'],
                'size_gb' => 0.8,
                'downloads' => 1000000,
                'date_release' => '2019-10-01',
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }
    }
}
