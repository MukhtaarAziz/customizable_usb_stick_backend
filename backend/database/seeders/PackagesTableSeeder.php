<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\GamePackage;
use App\Models\GamePlatform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackagesTableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pcPlatform = GamePlatform::where('name_en', 'PC')->first();
        $ps5Platform = GamePlatform::where('name_en', 'PS5')->first();
        $ps4Platform = GamePlatform::where('name_en', 'PS4')->first();

        if (! $pcPlatform || ! $ps5Platform || ! $ps4Platform) {
            return;
        }

        $nfsGames = Game::whereIn('name_en', [
            'Need for Speed: Underground',
            'Need for Speed: Most Wanted',
            'Need for Speed: Heat',
            'Need for Speed: Hot Pursuit',
            'Need for Speed: Unleashed',
        ])->get();

        if ($nfsGames->count() >= 5) {
            $package = GamePackage::create([
                'name_en' => 'Need for Speed Collection',
                'description_en' => 'A complete package of five iconic Need for Speed racing games.',
                'name_ar' => 'مجموعة Need for Speed',
                'description_ar' => 'حزمة كاملة من خمس ألعاب سباق أيقونية من سلسلة Need for Speed.',
                'cover_id' => null,
                'game_platform_id' => $ps5Platform->id,
                'views' => 0,
                'order_count' => 0,
            ]);

            $package->games()->sync($nfsGames->pluck('id')->all());
        }

        $codGames = Game::whereIn('name_en', [
            'Call of Duty: Modern Warfare',
            'Call of Duty: Black Ops Cold War',
            'Call of Duty: Vanguard',
            'Call of Duty: Warzone',
            'Call of Duty: Mobile',
        ])->get();

        if ($codGames->count() >= 5) {
            $package = GamePackage::create([
                'name_en' => 'Call of Duty Collection',
                'description_en' => 'A collection of five popular Call of Duty titles across platforms.',
                'name_ar' => 'مجموعة Call of Duty',
                'description_ar' => 'مجموعة من خمس ألعاب شهيرة من سلسلة Call of Duty عبر المنصات.',
                'cover_id' => null,
                'game_platform_id' => $pcPlatform->id,
                'views' => 0,
                'order_count' => 0,
            ]);

            $package->games()->sync($codGames->pluck('id')->all());
        }
    }
}
