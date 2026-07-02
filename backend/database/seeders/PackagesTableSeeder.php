<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Package;
use App\Models\PackageCategoryType;
use App\Models\PackageItem;
use App\Models\Platform;
use App\Models\Program;
use App\Models\StorageDevice;
use Illuminate\Database\Seeder;

class PackagesTableSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = Platform::pluck('id', 'name_en');
        $types = PackageCategoryType::pluck('id', 'name_en');
        $games = Game::all();
        $programs = Program::all();
        $storageDeviceIds = StorageDevice::pluck('id');

        if ($storageDeviceIds->isEmpty()) {
            $storageDeviceIds = collect([null]);
        }

        $gamesByPlatform = $games->groupBy('platform_id');
        $programsByPlatform = $programs->groupBy('platform_id');

        $packages = [];
        $typeNames = ['Games', 'Programs', 'Mixed'];

        $nameTemplates = [
            'Games' => [
                'prefix_en' => ['Action', 'Ultimate', 'Mega', 'Elite', 'Premium', 'Classic', 'Legendary', 'Epic', 'Power', 'Golden'],
                'suffix_en' => ['Pack', 'Bundle', 'Collection', 'Set', 'Kit'],
                'prefix_ar' => ['أكشن', 'ألتميت', 'ميغا', 'إيليت', 'بريميوم', 'كلاسيك', 'أسطوري', 'ملحمي', 'قوي', 'ذهبي'],
                'suffix_ar' => ['باقة', 'حزمة', 'مجموعة', 'طقم'],
            ],
            'Programs' => [
                'prefix_en' => ['Pro', 'Essential', 'Business', 'Creative', 'Developer', 'Master', 'Expert', 'Studio', 'Digital', 'Smart'],
                'suffix_en' => ['Suite', 'Bundle', 'Collection', 'Pack', 'Kit'],
                'prefix_ar' => ['برو', 'أساسي', 'أعمال', 'إبداعي', 'مطور', 'ماهر', 'خبير', 'ستوديو', 'رقمي', 'ذكي'],
                'suffix_ar' => ['مجموعة', 'حزمة', 'باقة', 'طقم'],
            ],
            'Mixed' => [
                'prefix_en' => ['Ultimate', 'Complete', 'Total', 'Supreme', 'All-in-One', 'Master', 'Platinum', 'Deluxe', 'Premium', 'Hyper'],
                'suffix_en' => ['Experience', 'Combo', 'Bundle', 'Package', 'Edition'],
                'prefix_ar' => ['شاملة', 'كاملة', 'توتال', 'سوبريم', 'كل في واحد', 'ماستر', 'بلاتينيوم', 'ديلوكس', 'بريميوم', 'هايبر'],
                'suffix_ar' => ['تجربة', 'مزيج', 'حزمة', 'باقة', 'إصدار'],
            ],
        ];

        $seed = 42;

        for ($i = 0; $i < 50; $i++) {
            $typeKey = $typeNames[$i % 3];
            $typeId = $types[$typeKey] ?? null;
            if (!$typeId) continue;

            $platformId = $platforms->random();
            $tmpl = $nameTemplates[$typeKey];
            $ti = $i % count($tmpl['prefix_en']);
            $si = ($i * 3 + 7) % count($tmpl['suffix_en']);

            $items = [];
            $firstItemEn = '';
            $firstItemAr = '';
            $itemCount = 0;

            if ($typeKey === 'Games' || $typeKey === 'Mixed') {
                $pool = $gamesByPlatform->get($platformId, $games);
                if ($pool->isEmpty()) $pool = $games;
                $pick = $pool->random(min(rand(2, 5), $pool->count()));
                foreach ($pick as $g) {
                    $items[] = ['type' => 'game', 'id' => $g->id];
                }
                $firstItemEn = $pick->first()->name_en;
                $firstItemAr = $pick->first()->name_ar;
                $itemCount += $pick->count();
            }

            if ($typeKey === 'Programs' || $typeKey === 'Mixed') {
                $pool = $programsByPlatform->get($platformId, $programs);
                if ($pool->isEmpty()) $pool = $programs;
                $pick = $pool->random(min(rand(2, 5), $pool->count()));
                foreach ($pick as $p) {
                    $items[] = ['type' => 'program', 'id' => $p->id];
                }
                if (empty($firstItemEn)) {
                    $firstItemEn = $pick->first()->name_en;
                    $firstItemAr = $pick->first()->name_ar;
                }
                $itemCount += $pick->count();
            }

            if (empty($items)) continue;

            $nameEn = $tmpl['prefix_en'][$ti] . ' ' . $firstItemEn . ' ' . $tmpl['suffix_en'][$si];
            $nameAr = $tmpl['prefix_ar'][$ti] . ' ' . $firstItemAr . ' ' . $tmpl['suffix_ar'][$si];
            $descEn = ($typeKey === 'Mixed'
                ? "A perfect blend of games and programs featuring {$firstItemEn} and {$itemCount} total items for your device."
                : "{$tmpl['prefix_en'][$ti]} collection featuring {$firstItemEn} and {$itemCount} carefully selected items.");
            $descAr = ($typeKey === 'Mixed'
                ? "مزيج مثالي من الألعاب والبرامج يضم {$firstItemAr} و{$itemCount} عنصراً لجهازك."
                : "مجموعة {$tmpl['prefix_ar'][$ti]} تضم {$firstItemAr} و{$itemCount} عنصراً مختاراً بعناية.");
            $price = round(mt_rand(5000, 80000) / 100, 2);
            $discount = round(mt_rand(0, 3000) / 10000, 2);

            $packages[] = [
                'name_en' => $nameEn,
                'name_ar' => $nameAr,
                'description_en' => $descEn,
                'description_ar' => $descAr,
                'platform_id' => $platformId,
                'type' => $typeKey,
                'price' => $price,
                'discount' => $discount,
                'active' => true,
                'items' => $items,
            ];
        }

        foreach ($packages as $pkg) {
            $typeId = $types[$pkg['type']] ?? null;
            if (!$typeId) continue;

            $created = Package::create([
                'name_en' => $pkg['name_en'],
                'name_ar' => $pkg['name_ar'],
                'description_en' => $pkg['description_en'],
                'description_ar' => $pkg['description_ar'],
                'platform_id' => $pkg['platform_id'],
                'package_category_type_id' => $typeId,
                'active' => $pkg['active'],
                'price_iqd' => $pkg['price'],
                'discount' => $pkg['discount'],
                'storage_device_id' => $storageDeviceIds->random(),
                'views' => mt_rand(100, 5000),
                'order_count' => mt_rand(10, 500),
            ]);

            foreach ($pkg['items'] as $item) {
                PackageItem::create([
                    'package_id' => $created->id,
                    'itemable_type' => $item['type'] === 'game' ? Game::class : Program::class,
                    'itemable_id' => $item['id'],
                ]);
            }
        }
    }
}
