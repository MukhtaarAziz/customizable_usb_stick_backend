<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Package;
use App\Models\PackageCategoryType;
use App\Models\PackageItem;
use App\Models\Platform;
use App\Models\Program;
use Illuminate\Database\Seeder;

class PackagesTableSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = Platform::pluck('id', 'name_en');
        $types = PackageCategoryType::pluck('id', 'name_en');
        $games = Game::pluck('id', 'name_en');
        $programs = Program::pluck('id', 'name_en');

        $packages = [
            // ---- GAME PACKAGES ----
            [
                'name_en' => 'PS5 Action Pack',
                'name_ar' => 'باقة ألعاب الأكشن PS5',
                'description_en' => 'Top action titles for PlayStation 5 including God of War, Spider-Man and more.',
                'description_ar' => 'أفضل ألعاب الأكشن على بلاي ستيشن 5 بما في ذلك غود أوف وار وسبايدر مان والمزيد.',
                'platform' => 'PS5',
                'type' => 'Games',
                'price' => 149.99,
                'active' => true,
                'discount' => 0.15,
                'items' => [
                    ['type' => 'game', 'name' => 'God of War Ragnarok'],
                    ['type' => 'game', 'name' => 'Spider-Man 2'],
                    ['type' => 'game', 'name' => 'Horizon Forbidden West'],
                    ['type' => 'game', 'name' => 'The Last of Us Part I'],
                ],
            ],
            [
                'name_en' => 'Xbox Essentials Pack',
                'name_ar' => 'باقة أساسيات إكس بوكس',
                'description_en' => 'Must-have Xbox games featuring Halo, Forza, and Starfield.',
                'description_ar' => 'ألعاب إكس بوكس الأساسية بما في ذلك هالو وفورزا وستارفيلد.',
                'platform' => 'Xbox',
                'type' => 'Games',
                'price' => 129.99,
                'items' => [
                    ['type' => 'game', 'name' => 'Halo Infinite'],
                    ['type' => 'game', 'name' => 'Forza Horizon 5'],
                    ['type' => 'game', 'name' => 'Starfield'],
                    ['type' => 'game', 'name' => 'Gears 5'],
                ],
            ],
            [
                'name_en' => 'PC Gaming Mega Pack',
                'name_ar' => 'باقة ألعاب الكمبيوتر الضخمة',
                'description_en' => 'The ultimate PC gaming collection with competitive shooters and RPGs.',
                'description_ar' => 'مجموعة ألعاب الكمبيوتر المثالية مع ألعاب التصويب التنافسية وألعاب تقمص الأدوار.',
                'platform' => 'PC',
                'type' => 'Games',
                'price' => 99.99,
                'items' => [
                    ['type' => 'game', 'name' => 'Counter-Strike 2'],
                    ['type' => 'game', 'name' => 'Valorant'],
                    ['type' => 'game', 'name' => 'PUBG: Battlegrounds'],
                    ['type' => 'game', 'name' => 'Rocket League'],
                    ['type' => 'game', 'name' => 'Path of Exile'],
                ],
            ],
            // ---- PROGRAM PACKAGES ----
            [
                'name_en' => 'Office Productivity Suite',
                'name_ar' => 'باقة الإنتاجية المكتبية',
                'description_en' => 'Complete office and productivity programs for Windows.',
                'description_ar' => 'مجموعة متكاملة من برامج المكتب والإنتاجية لويندوز.',
                'platform' => 'Windows',
                'type' => 'Programs',
                'price' => 199.99,
                'items' => [
                    ['type' => 'program', 'name' => 'Microsoft Office 2024'],
                    ['type' => 'program', 'name' => 'Microsoft Word'],
                    ['type' => 'program', 'name' => 'Microsoft Excel'],
                    ['type' => 'program', 'name' => 'Microsoft PowerPoint'],
                    ['type' => 'program', 'name' => 'Microsoft Outlook'],
                ],
            ],
            [
                'name_en' => 'Creative Design Bundle',
                'name_ar' => 'باقة التصميم الإبداعي',
                'description_en' => 'Professional creative tools for designers and content creators.',
                'description_ar' => 'أدوات إبداعية احترافية للمصممين ومنشئي المحتوى.',
                'platform' => 'Windows',
                'type' => 'Programs',
                'price' => 299.99,
                'items' => [
                    ['type' => 'program', 'name' => 'Adobe Photoshop 2025'],
                    ['type' => 'program', 'name' => 'Adobe Premiere Pro'],
                    ['type' => 'program', 'name' => 'Adobe After Effects'],
                    ['type' => 'program', 'name' => 'Adobe Illustrator'],
                    ['type' => 'program', 'name' => 'Adobe Lightroom'],
                ],
            ],
            [
                'name_en' => 'Developer Toolbox',
                'name_ar' => 'صندوق أدوات المطور',
                'description_en' => 'Essential development tools and environments for programmers.',
                'description_ar' => 'أدوات وبيئات تطوير أساسية للمبرمجين.',
                'platform' => 'Windows',
                'type' => 'Programs',
                'price' => 49.99,
                'items' => [
                    ['type' => 'program', 'name' => 'Visual Studio Code'],
                    ['type' => 'program', 'name' => 'GitHub Desktop'],
                    ['type' => 'program', 'name' => 'Docker Desktop'],
                    ['type' => 'program', 'name' => 'Postman'],
                    ['type' => 'program', 'name' => 'MySQL Workbench'],
                ],
            ],
            // ---- MIXED PACKAGES ----
            [
                'name_en' => 'Ultimate PC Experience',
                'name_ar' => 'تجربة الكمبيوتر الشاملة',
                'description_en' => 'A perfect blend of top games and essential programs for your PC.',
                'description_ar' => 'مزيج مثالي من أفضل الألعاب والبرامج الأساسية لجهاز الكمبيوتر الخاص بك.',
                'platform' => 'PC',
                'type' => 'Mixed',
                'price' => 249.99,
                'items' => [
                    ['type' => 'game', 'name' => 'Minecraft'],
                    ['type' => 'game', 'name' => 'Rocket League'],
                    ['type' => 'program', 'name' => 'Visual Studio Code'],
                    ['type' => 'program', 'name' => 'Discord'],
                    ['type' => 'program', 'name' => 'Google Chrome'],
                ],
            ],
        ];

        $createdPackages = [];

        foreach ($packages as $pkg) {
            $platformId = $platforms[$pkg['platform']] ?? null;
            $typeId = $types[$pkg['type']] ?? null;

            if (!$platformId || !$typeId) {
                continue;
            }

            $created = Package::create([
                'name_en' => $pkg['name_en'],
                'name_ar' => $pkg['name_ar'],
                'description_en' => $pkg['description_en'],
                'description_ar' => $pkg['description_ar'],
                'platform_id' => $platformId,
                'package_category_type_id' => $typeId,
                'active' => $pkg['active'] ?? true,
                'price_iqd' => $pkg['price'],
                'discount' => $pkg['discount'] ?? 0.00,
                'views' => rand(100, 5000),
                'order_count' => rand(10, 500),
            ]);

            $createdPackages[] = $created;

            foreach ($pkg['items'] as $item) {
                $itemableId = null;
                $itemableClass = null;

                if ($item['type'] === 'game') {
                    $itemableId = $games[$item['name']] ?? null;
                    $itemableClass = Game::class;
                } else {
                    $itemableId = $programs[$item['name']] ?? null;
                    $itemableClass = Program::class;
                }

                if (!$itemableId || !$itemableClass) {
                    continue;
                }

                PackageItem::create([
                    'package_id' => $created->id,
                    'itemable_type' => $itemableClass,
                    'itemable_id' => $itemableId,
                ]);
            }
        }
    }
}
