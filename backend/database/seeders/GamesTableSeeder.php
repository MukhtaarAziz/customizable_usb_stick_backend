<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\GameCategory;
use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GamesTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = GameCategory::pluck('id', 'name_en');
        $platforms = Platform::pluck('id', 'name_en');

        $games = [
            ['name_en' => 'Grand Theft Auto V', 'name_ar' => 'جراند ثيفت أوتو 5', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['open-world', 'action', 'crime'], 'size_gb' => 72.0, 'downloads' => 8500000, 'date_release' => '2013-09-17'],
            ['name_en' => 'Red Dead Redemption 2', 'name_ar' => 'ريد ديد ريدمبشن 2', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['western', 'open-world', 'adventure'], 'size_gb' => 105.0, 'downloads' => 3200000, 'date_release' => '2018-10-26'],
            ['name_en' => 'The Witcher 3: Wild Hunt', 'name_ar' => 'ذا ويتشر 3: الصيد البري', 'category' => 'RPG', 'platform' => 'PS5', 'tags' => ['rpg', 'fantasy', 'open-world'], 'size_gb' => 50.0, 'downloads' => 4500000, 'date_release' => '2015-05-19'],
            ['name_en' => 'Cyberpunk 2077', 'name_ar' => 'سايبربانك 2077', 'category' => 'RPG', 'platform' => 'PS5', 'tags' => ['rpg', 'sci-fi', 'open-world'], 'size_gb' => 65.0, 'downloads' => 2800000, 'date_release' => '2020-12-10'],
            ['name_en' => 'Elden Ring', 'name_ar' => 'إلدن رينج', 'category' => 'RPG', 'platform' => 'PS5', 'tags' => ['rpg', 'fantasy', 'soulslike'], 'size_gb' => 48.0, 'downloads' => 5200000, 'date_release' => '2022-02-25'],
            ['name_en' => 'God of War Ragnarok', 'name_ar' => 'غود أوف وار: راغناروك', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['action', 'mythology', 'adventure'], 'size_gb' => 84.0, 'downloads' => 4100000, 'date_release' => '2022-11-09'],
            ['name_en' => 'Spider-Man 2', 'name_ar' => 'سبايدر مان 2', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['superhero', 'open-world', 'action'], 'size_gb' => 56.0, 'downloads' => 3800000, 'date_release' => '2023-10-20'],
            ['name_en' => 'Horizon Forbidden West', 'name_ar' => 'هورايزن: الغرب المحظور', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['open-world', 'sci-fi', 'adventure'], 'size_gb' => 62.0, 'downloads' => 2900000, 'date_release' => '2022-02-18'],
            ['name_en' => 'Final Fantasy XVI', 'name_ar' => 'فاينال فانتسي 16', 'category' => 'RPG', 'platform' => 'PS5', 'tags' => ['rpg', 'fantasy', 'story'], 'size_gb' => 90.0, 'downloads' => 2100000, 'date_release' => '2023-06-22'],
            ['name_en' => 'Ratchet & Clank: Rift Apart', 'name_ar' => 'راتشت أند كلانك: ريفت أبارت', 'category' => 'Platformer', 'platform' => 'PS5', 'tags' => ['platformer', 'adventure', 'sci-fi'], 'size_gb' => 35.0, 'downloads' => 1800000, 'date_release' => '2021-06-11'],
            ['name_en' => 'Demon\'s Souls', 'name_ar' => 'ديمونز سولز', 'category' => 'RPG', 'platform' => 'PS5', 'tags' => ['soulslike', 'fantasy', 'challenging'], 'size_gb' => 40.0, 'downloads' => 1500000, 'date_release' => '2020-11-12'],
            ['name_en' => 'Gran Turismo 7', 'name_ar' => 'غران توريزمو 7', 'category' => 'Racing', 'platform' => 'PS5', 'tags' => ['racing', 'simulation', 'sports'], 'size_gb' => 95.0, 'downloads' => 2600000, 'date_release' => '2022-03-04'],
            ['name_en' => 'The Last of Us Part I', 'name_ar' => 'ذا لاست أوف أس: الجزء الأول', 'category' => 'Action', 'platform' => 'PS5', 'tags' => ['survival', 'horror', 'story'], 'size_gb' => 42.0, 'downloads' => 3500000, 'date_release' => '2022-09-02'],
            ['name_en' => 'Forza Horizon 5', 'name_ar' => 'فورزا هورايزون 5', 'category' => 'Racing', 'platform' => 'Xbox', 'tags' => ['racing', 'open-world', 'arcade'], 'size_gb' => 103.0, 'downloads' => 3700000, 'date_release' => '2021-11-09'],
            ['name_en' => 'Halo Infinite', 'name_ar' => 'هالو إنفينيت', 'category' => 'Shooter', 'platform' => 'Xbox', 'tags' => ['shooter', 'sci-fi', 'multiplayer'], 'size_gb' => 65.0, 'downloads' => 2400000, 'date_release' => '2021-12-08'],
            ['name_en' => 'Gears 5', 'name_ar' => 'غيرز 5', 'category' => 'Shooter', 'platform' => 'Xbox', 'tags' => ['shooter', 'action', 'sci-fi'], 'size_gb' => 55.0, 'downloads' => 1900000, 'date_release' => '2019-09-10'],
            ['name_en' => 'Starfield', 'name_ar' => 'ستارفيلد', 'category' => 'RPG', 'platform' => 'Xbox', 'tags' => ['rpg', 'sci-fi', 'space'], 'size_gb' => 115.0, 'downloads' => 3100000, 'date_release' => '2023-09-06'],
            ['name_en' => 'Sea of Thieves', 'name_ar' => 'سي أوف ثيفز', 'category' => 'Adventure', 'platform' => 'Xbox', 'tags' => ['pirate', 'multiplayer', 'adventure'], 'size_gb' => 35.0, 'downloads' => 2200000, 'date_release' => '2018-03-20'],
            ['name_en' => 'Microsoft Flight Simulator', 'name_ar' => 'مايكروسوفت فلايت سيميوليتر', 'category' => 'Simulation', 'platform' => 'Xbox', 'tags' => ['simulation', 'flying', 'realistic'], 'size_gb' => 150.0, 'downloads' => 1600000, 'date_release' => '2021-07-27'],
            ['name_en' => 'Forza Motorsport', 'name_ar' => 'فورزا موتورسبورت', 'category' => 'Racing', 'platform' => 'Xbox', 'tags' => ['racing', 'simulation', 'sports'], 'size_gb' => 96.0, 'downloads' => 2100000, 'date_release' => '2023-10-10'],
            ['name_en' => 'The Legend of Zelda: Tears of the Kingdom', 'name_ar' => 'أسطورة زيلدا: دموع المملكة', 'category' => 'Adventure', 'platform' => 'Nintendo Switch', 'tags' => ['adventure', 'open-world', 'puzzle'], 'size_gb' => 18.0, 'downloads' => 7500000, 'date_release' => '2023-05-12'],
            ['name_en' => 'Super Mario Odyssey', 'name_ar' => 'سوبر ماريو أوديسي', 'category' => 'Platformer', 'platform' => 'Nintendo Switch', 'tags' => ['platformer', 'adventure', 'family'], 'size_gb' => 5.8, 'downloads' => 6800000, 'date_release' => '2017-10-27'],
            ['name_en' => 'Animal Crossing: New Horizons', 'name_ar' => 'أنيمال كروسينغ: نيور هورايزنز', 'category' => 'Simulation', 'platform' => 'Nintendo Switch', 'tags' => ['simulation', 'casual', 'life-sim'], 'size_gb' => 6.3, 'downloads' => 8500000, 'date_release' => '2020-03-20'],
            ['name_en' => 'Pokémon Scarlet and Violet', 'name_ar' => 'بوكيمون سكارليت أند فايوليت', 'category' => 'RPG', 'platform' => 'Nintendo Switch', 'tags' => ['rpg', 'adventure', 'collecting'], 'size_gb' => 7.0, 'downloads' => 6000000, 'date_release' => '2022-11-18'],
            ['name_en' => 'Splatoon 3', 'name_ar' => 'سبلاتون 3', 'category' => 'Shooter', 'platform' => 'Nintendo Switch', 'tags' => ['shooter', 'multiplayer', 'colorful'], 'size_gb' => 4.5, 'downloads' => 4000000, 'date_release' => '2022-09-09'],
            ['name_en' => 'Super Smash Bros. Ultimate', 'name_ar' => 'سوبر سماش بروس ألتيميت', 'category' => 'Fighting', 'platform' => 'Nintendo Switch', 'tags' => ['fighting', 'multiplayer', 'crossover'], 'size_gb' => 13.0, 'downloads' => 7200000, 'date_release' => '2018-12-07'],
            ['name_en' => 'Mario Kart 8 Deluxe', 'name_ar' => 'ماريو كارت 8 ديلوكس', 'category' => 'Racing', 'platform' => 'Nintendo Switch', 'tags' => ['racing', 'family', 'party'], 'size_gb' => 7.0, 'downloads' => 7800000, 'date_release' => '2017-04-28'],
            ['name_en' => 'Xenoblade Chronicles 3', 'name_ar' => 'زينوبليد كرونيكلز 3', 'category' => 'RPG', 'platform' => 'Nintendo Switch', 'tags' => ['rpg', 'fantasy', 'story'], 'size_gb' => 14.0, 'downloads' => 1900000, 'date_release' => '2022-07-29'],
            ['name_en' => 'Metroid Dread', 'name_ar' => 'ميترويد دريد', 'category' => 'Action', 'platform' => 'Nintendo Switch', 'tags' => ['action', 'sci-fi', 'exploration'], 'size_gb' => 4.8, 'downloads' => 3500000, 'date_release' => '2021-10-08'],
            ['name_en' => 'Luigi\'s Mansion 3', 'name_ar' => 'لويجيز مانشن 3', 'category' => 'Adventure', 'platform' => 'Nintendo Switch', 'tags' => ['adventure', 'horror', 'family'], 'size_gb' => 6.0, 'downloads' => 2700000, 'date_release' => '2019-10-31'],
            ['name_en' => 'PUBG: Battlegrounds', 'name_ar' => 'PUBG: باتل جراوندز', 'category' => 'Battle Royale', 'platform' => 'PC', 'tags' => ['battle-royale', 'shooter', 'multiplayer'], 'size_gb' => 30.0, 'downloads' => 9000000, 'date_release' => '2017-12-20'],
            ['name_en' => 'Counter-Strike 2', 'name_ar' => 'كاونتر سترايك 2', 'category' => 'Shooter', 'platform' => 'PC', 'tags' => ['shooter', 'competitive', 'multiplayer'], 'size_gb' => 25.0, 'downloads' => 11000000, 'date_release' => '2023-09-27'],
            ['name_en' => 'Dota 2', 'name_ar' => 'دوتا 2', 'category' => 'Strategy', 'platform' => 'PC', 'tags' => ['moba', 'strategy', 'competitive'], 'size_gb' => 12.0, 'downloads' => 7000000, 'date_release' => '2013-07-09'],
            ['name_en' => 'World of Warcraft', 'name_ar' => 'وورلد أوف ووركرافت', 'category' => 'MMORPG', 'platform' => 'PC', 'tags' => ['mmorpg', 'fantasy', 'multiplayer'], 'size_gb' => 65.0, 'downloads' => 5500000, 'date_release' => '2004-11-23'],
            ['name_en' => 'Minecraft', 'name_ar' => 'ماينكرافت', 'category' => 'Survival', 'platform' => 'PC', 'tags' => ['survival', 'sandbox', 'building'], 'size_gb' => 0.6, 'downloads' => 15000000, 'date_release' => '2011-11-18'],
            ['name_en' => 'League of Legends', 'name_ar' => 'ليغ أوف ليجيندز', 'category' => 'Strategy', 'platform' => 'PC', 'tags' => ['moba', 'strategy', 'competitive'], 'size_gb' => 8.0, 'downloads' => 12000000, 'date_release' => '2009-10-27'],
            ['name_en' => 'Valorant', 'name_ar' => 'فالورانت', 'category' => 'Shooter', 'platform' => 'PC', 'tags' => ['shooter', 'tactical', 'competitive'], 'size_gb' => 15.0, 'downloads' => 8000000, 'date_release' => '2020-06-02'],
            ['name_en' => 'Path of Exile', 'name_ar' => 'باث أوف إكسايل', 'category' => 'RPG', 'platform' => 'PC', 'tags' => ['rpg', 'action', 'loot'], 'size_gb' => 25.0, 'downloads' => 3500000, 'date_release' => '2013-10-23'],
            ['name_en' => 'Rocket League', 'name_ar' => 'روكت ليج', 'category' => 'Sports', 'platform' => 'PC', 'tags' => ['sports', 'cars', 'multiplayer'], 'size_gb' => 6.0, 'downloads' => 5800000, 'date_release' => '2015-07-07'],
            ['name_en' => 'Team Fortress 2', 'name_ar' => 'تيم فورترس 2', 'category' => 'Shooter', 'platform' => 'PC', 'tags' => ['shooter', 'multiplayer', 'comedy'], 'size_gb' => 8.0, 'downloads' => 6200000, 'date_release' => '2007-10-10'],
            ['name_en' => 'Fortnite', 'name_ar' => 'فورتنايت', 'category' => 'Battle Royale', 'platform' => 'PS4', 'tags' => ['battle-royale', 'shooter', 'building'], 'size_gb' => 18.0, 'downloads' => 20000000, 'date_release' => '2017-07-25'],
            ['name_en' => 'FIFA 24', 'name_ar' => 'فيفا 24', 'category' => 'Sports', 'platform' => 'PS4', 'tags' => ['sports', 'football', 'multiplayer'], 'size_gb' => 42.0, 'downloads' => 4500000, 'date_release' => '2023-09-29'],
            ['name_en' => 'Grand Theft Auto: San Andreas', 'name_ar' => 'جراند ثيفت أوتو: سان أندرياس', 'category' => 'Action', 'platform' => 'PS2', 'tags' => ['open-world', 'action', 'crime'], 'size_gb' => 4.7, 'downloads' => 8000000, 'date_release' => '2004-10-26'],
            ['name_en' => 'Shadow of the Colossus', 'name_ar' => 'ظل العملاق', 'category' => 'Adventure', 'platform' => 'PS2', 'tags' => ['adventure', 'boss-fights', 'artistic'], 'size_gb' => 2.5, 'downloads' => 3500000, 'date_release' => '2005-10-18'],
            ['name_en' => 'Metal Gear Solid 3: Snake Eater', 'name_ar' => 'ميتال غير سوليد 3', 'category' => 'Stealth', 'platform' => 'PS2', 'tags' => ['stealth', 'action', 'cold-war'], 'size_gb' => 3.8, 'downloads' => 4000000, 'date_release' => '2004-11-17'],
            ['name_en' => 'God of War II', 'name_ar' => 'غود أوف وار 2', 'category' => 'Action', 'platform' => 'PS2', 'tags' => ['action', 'mythology', 'hack-and-slash'], 'size_gb' => 3.5, 'downloads' => 4200000, 'date_release' => '2007-03-13'],
            ['name_en' => 'Resident Evil 4', 'name_ar' => 'ريزدنت إيفل 4', 'category' => 'Horror', 'platform' => 'PS2', 'tags' => ['horror', 'survival', 'action'], 'size_gb' => 2.8, 'downloads' => 5500000, 'date_release' => '2005-10-25'],
            ['name_en' => 'Final Fantasy X', 'name_ar' => 'فاينال فانتسي 10', 'category' => 'RPG', 'platform' => 'PS2', 'tags' => ['rpg', 'fantasy', 'story'], 'size_gb' => 3.2, 'downloads' => 5200000, 'date_release' => '2001-12-17'],
            ['name_en' => 'Crash Bandicoot: Warped', 'name_ar' => 'كراش بانديكوت: واربد', 'category' => 'Platformer', 'platform' => 'PS1', 'tags' => ['platformer', 'adventure', 'classic'], 'size_gb' => 0.3, 'downloads' => 3800000, 'date_release' => '1998-10-31'],
            ['name_en' => 'Tony Hawk\'s Pro Skater 2', 'name_ar' => 'توني هوك برو سكيتر 2', 'category' => 'Sports', 'platform' => 'PS1', 'tags' => ['sports', 'skateboarding', 'arcade'], 'size_gb' => 0.2, 'downloads' => 3500000, 'date_release' => '2000-09-20'],
            ['name_en' => 'Final Fantasy VII', 'name_ar' => 'فاينال فانتسي 7', 'category' => 'RPG', 'platform' => 'PS1', 'tags' => ['rpg', 'fantasy', 'classic'], 'size_gb' => 1.3, 'downloads' => 7000000, 'date_release' => '1997-01-31'],
            ['name_en' => 'Metal Gear Solid', 'name_ar' => 'ميتال غير سوليد', 'category' => 'Stealth', 'platform' => 'PS1', 'tags' => ['stealth', 'action', 'tactical'], 'size_gb' => 0.6, 'downloads' => 4500000, 'date_release' => '1998-09-03'],
            ['name_en' => 'Resident Evil 2', 'name_ar' => 'ريزدنت إيفل 2', 'category' => 'Horror', 'platform' => 'PS1', 'tags' => ['horror', 'survival', 'zombie'], 'size_gb' => 0.5, 'downloads' => 3800000, 'date_release' => '1998-01-21'],
            ['name_en' => 'The Legend of Zelda: Ocarina of Time', 'name_ar' => 'زيلدا: أوكرينا أوف تايم', 'category' => 'Adventure', 'platform' => 'Nintendo 3DS', 'tags' => ['adventure', 'puzzle', 'classic'], 'size_gb' => 0.4, 'downloads' => 4200000, 'date_release' => '1998-11-21'],
            ['name_en' => 'Super Mario 64', 'name_ar' => 'سوبر ماريو 64', 'category' => 'Platformer', 'platform' => 'Nintendo 3DS', 'tags' => ['platformer', '3d', 'classic'], 'size_gb' => 0.1, 'downloads' => 4500000, 'date_release' => '1996-06-23'],
            ['name_en' => 'Pokémon Omega Ruby', 'name_ar' => 'بوكيمون أوميغا روبي', 'category' => 'RPG', 'platform' => 'Nintendo 3DS', 'tags' => ['rpg', 'adventure', 'collecting'], 'size_gb' => 1.8, 'downloads' => 3200000, 'date_release' => '2014-11-21'],
            ['name_en' => 'Monster Hunter 4 Ultimate', 'name_ar' => 'مونستر هنتر 4 ألتيميت', 'category' => 'Action', 'platform' => 'Nintendo 3DS', 'tags' => ['action', 'hunting', 'multiplayer'], 'size_gb' => 2.5, 'downloads' => 2800000, 'date_release' => '2015-02-13'],
            ['name_en' => 'Fire Emblem Awakening', 'name_ar' => 'فاير إمبلم أويكنينغ', 'category' => 'Strategy', 'platform' => 'Nintendo 3DS', 'tags' => ['strategy', 'tactical', 'rpg'], 'size_gb' => 1.2, 'downloads' => 2100000, 'date_release' => '2013-02-04'],
            ['name_en' => 'Persona 5', 'name_ar' => 'بيرسونا 5', 'category' => 'RPG', 'platform' => 'PS4', 'tags' => ['rpg', 'story', 'stylish'], 'size_gb' => 28.0, 'downloads' => 4200000, 'date_release' => '2017-04-04'],
            ['name_en' => 'Bloodborne', 'name_ar' => 'بلودبورن', 'category' => 'Action', 'platform' => 'PS4', 'tags' => ['action', 'horror', 'soulslike'], 'size_gb' => 30.0, 'downloads' => 3600000, 'date_release' => '2015-03-24'],
            ['name_en' => 'Uncharted 4: A Thief\'s End', 'name_ar' => 'أنشارتد 4: نهاية اللص', 'category' => 'Action', 'platform' => 'PS4', 'tags' => ['adventure', 'action', 'story'], 'size_gb' => 38.0, 'downloads' => 3700000, 'date_release' => '2016-05-10'],
            ['name_en' => 'God of War', 'name_ar' => 'غود أوف وار', 'category' => 'Action', 'platform' => 'PS4', 'tags' => ['action', 'mythology', 'story'], 'size_gb' => 45.0, 'downloads' => 5100000, 'date_release' => '2018-04-20'],
            ['name_en' => 'Spider-Man', 'name_ar' => 'سبايدر مان', 'category' => 'Action', 'platform' => 'PS4', 'tags' => ['superhero', 'open-world', 'action'], 'size_gb' => 42.0, 'downloads' => 4800000, 'date_release' => '2018-09-07'],
            ['name_en' => 'Sekiro: Shadows Die Twice', 'name_ar' => 'سيكيرو: الظلال تموت مرتين', 'category' => 'Action', 'platform' => 'PS4', 'tags' => ['action', 'ninja', 'challenging'], 'size_gb' => 12.0, 'downloads' => 2300000, 'date_release' => '2019-03-22'],
            ['name_en' => 'God of War III', 'name_ar' => 'غود أوف وار 3', 'category' => 'Action', 'platform' => 'PS3', 'tags' => ['action', 'mythology', 'hack-and-slash'], 'size_gb' => 16.0, 'downloads' => 4500000, 'date_release' => '2010-03-16'],
            ['name_en' => 'The Last of Us', 'name_ar' => 'ذا لاست أوف أس', 'category' => 'Action', 'platform' => 'PS3', 'tags' => ['survival', 'horror', 'story'], 'size_gb' => 22.0, 'downloads' => 4800000, 'date_release' => '2013-06-14'],
            ['name_en' => 'Uncharted 2: Among Thieves', 'name_ar' => 'أنشارتد 2: بين اللصوص', 'category' => 'Action', 'platform' => 'PS3', 'tags' => ['adventure', 'action', 'story'], 'size_gb' => 18.0, 'downloads' => 3800000, 'date_release' => '2009-10-13'],
            ['name_en' => 'LittleBigPlanet', 'name_ar' => 'ليتل بيغ بلانيت', 'category' => 'Platformer', 'platform' => 'PS3', 'tags' => ['platformer', 'creative', 'puzzle'], 'size_gb' => 5.0, 'downloads' => 2000000, 'date_release' => '2008-10-27'],
            ['name_en' => 'Journey', 'name_ar' => 'جورني', 'category' => 'Adventure', 'platform' => 'PS3', 'tags' => ['adventure', 'artistic', 'peaceful'], 'size_gb' => 0.6, 'downloads' => 1800000, 'date_release' => '2012-03-13'],
            ['name_en' => 'PUBG Mobile', 'name_ar' => 'PUBG موبايل', 'category' => 'Battle Royale', 'platform' => 'Android', 'tags' => ['battle-royale', 'shooter', 'mobile'], 'size_gb' => 1.2, 'downloads' => 25000000, 'date_release' => '2018-03-19'],
            ['name_en' => 'Genshin Impact', 'name_ar' => 'جينشين إمباكت', 'category' => 'RPG', 'platform' => 'Android', 'tags' => ['rpg', 'open-world', 'gacha'], 'size_gb' => 3.5, 'downloads' => 18000000, 'date_release' => '2020-09-28'],
            ['name_en' => 'Call of Duty: Mobile', 'name_ar' => 'كول أوف ديوتي: موبايل', 'category' => 'Shooter', 'platform' => 'Android', 'tags' => ['shooter', 'mobile', 'multiplayer'], 'size_gb' => 2.0, 'downloads' => 22000000, 'date_release' => '2019-10-01'],
            ['name_en' => 'Clash Royale', 'name_ar' => 'كلاش رويال', 'category' => 'Strategy', 'platform' => 'Android', 'tags' => ['strategy', 'card', 'multiplayer'], 'size_gb' => 0.3, 'downloads' => 15000000, 'date_release' => '2016-03-02'],
            ['name_en' => 'Pokémon GO', 'name_ar' => 'بوكيمون جو', 'category' => 'Adventure', 'platform' => 'Android', 'tags' => ['ar', 'adventure', 'collecting'], 'size_gb' => 0.5, 'downloads' => 28000000, 'date_release' => '2016-07-06'],
            ['name_en' => 'Candy Crush Saga', 'name_ar' => 'كاندي كراش ساغا', 'category' => 'Puzzle', 'platform' => 'Android', 'tags' => ['puzzle', 'casual', 'match-3'], 'size_gb' => 0.2, 'downloads' => 30000000, 'date_release' => '2012-11-14'],
            ['name_en' => 'Asphalt 9: Legends', 'name_ar' => 'أسبلت 9: ليجيندز', 'category' => 'Racing', 'platform' => 'Android', 'tags' => ['racing', 'arcade', 'mobile'], 'size_gb' => 1.8, 'downloads' => 12000000, 'date_release' => '2018-07-25'],
            ['name_en' => 'Mobile Legends', 'name_ar' => 'موبايل ليجيندز', 'category' => 'Strategy', 'platform' => 'Android', 'tags' => ['moba', 'strategy', 'mobile'], 'size_gb' => 0.8, 'downloads' => 20000000, 'date_release' => '2016-07-14'],
            ['name_en' => 'Clash of Clans', 'name_ar' => 'كلاش أوف كلانس', 'category' => 'Strategy', 'platform' => 'Android', 'tags' => ['strategy', 'building', 'multiplayer'], 'size_gb' => 0.4, 'downloads' => 26000000, 'date_release' => '2012-08-02'],
            ['name_en' => 'Subway Surfers', 'name_ar' => 'صبواي سيرفرز', 'category' => 'Arcade', 'platform' => 'Android', 'tags' => ['arcade', 'endless-runner', 'casual'], 'size_gb' => 0.1, 'downloads' => 35000000, 'date_release' => '2012-05-24'],
            ['name_en' => 'Honor of Kings', 'name_ar' => 'هونر أوف كينغز', 'category' => 'Strategy', 'platform' => 'Android', 'tags' => ['moba', 'strategy', 'competitive'], 'size_gb' => 1.5, 'downloads' => 40000000, 'date_release' => '2015-11-26'],
            ['name_en' => 'Temple Run 2', 'name_ar' => 'تمبل رن 2', 'category' => 'Arcade', 'platform' => 'iOS', 'tags' => ['arcade', 'endless-runner', 'casual'], 'size_gb' => 0.2, 'downloads' => 15000000, 'date_release' => '2013-01-17'],
            ['name_en' => 'Angry Birds 2', 'name_ar' => 'أنغري بيردز 2', 'category' => 'Puzzle', 'platform' => 'iOS', 'tags' => ['puzzle', 'physics', 'casual'], 'size_gb' => 0.3, 'downloads' => 12000000, 'date_release' => '2015-07-30'],
            ['name_en' => 'Roblox', 'name_ar' => 'روبلكس', 'category' => 'Casual', 'platform' => 'iOS', 'tags' => ['sandbox', 'creative', 'multiplayer'], 'size_gb' => 0.6, 'downloads' => 20000000, 'date_release' => '2012-01-01'],
            ['name_en' => 'Among Us', 'name_ar' => 'أمونغ أس', 'category' => 'Casual', 'platform' => 'iOS', 'tags' => ['casual', 'social', 'multiplayer'], 'size_gb' => 0.1, 'downloads' => 18000000, 'date_release' => '2018-06-15'],
            ['name_en' => 'God of War: Chains of Olympus', 'name_ar' => 'غود أوف وار: تشينز أوف أوليمبس', 'category' => 'Action', 'platform' => 'PSP', 'tags' => ['action', 'mythology', 'portable'], 'size_gb' => 1.2, 'downloads' => 2500000, 'date_release' => '2008-03-04'],
            ['name_en' => 'Grand Theft Auto: Vice City Stories', 'name_ar' => 'GTA: فايس سيتي ستوريز', 'category' => 'Action', 'platform' => 'PSP', 'tags' => ['open-world', 'action', 'portable'], 'size_gb' => 1.5, 'downloads' => 3500000, 'date_release' => '2006-10-31'],
            ['name_en' => 'Monster Hunter Freedom Unite', 'name_ar' => 'مونستر هنتر فريدوم يونيت', 'category' => 'Action', 'platform' => 'PSP', 'tags' => ['action', 'hunting', 'multiplayer'], 'size_gb' => 0.9, 'downloads' => 3000000, 'date_release' => '2008-03-27'],
            ['name_en' => 'Persona 3 Portable', 'name_ar' => 'بيرسونا 3 بورتابل', 'category' => 'RPG', 'platform' => 'PSP', 'tags' => ['rpg', 'story', 'portable'], 'size_gb' => 1.1, 'downloads' => 2200000, 'date_release' => '2009-11-01'],
            ['name_en' => 'Daxter', 'name_ar' => 'داكستر', 'category' => 'Platformer', 'platform' => 'PSP', 'tags' => ['platformer', 'adventure', 'comedy'], 'size_gb' => 0.8, 'downloads' => 1800000, 'date_release' => '2006-03-14'],
            ['name_en' => 'Shenmue', 'name_ar' => 'شينمو', 'category' => 'Adventure', 'platform' => 'Dreamcast', 'tags' => ['adventure', 'open-world', 'story'], 'size_gb' => 2.5, 'downloads' => 2000000, 'date_release' => '1999-12-29'],
            ['name_en' => 'Crazy Taxi', 'name_ar' => 'كريزي تاكسي', 'category' => 'Arcade', 'platform' => 'Dreamcast', 'tags' => ['arcade', 'racing', 'comedy'], 'size_gb' => 0.4, 'downloads' => 2200000, 'date_release' => '1999-01-01'],
            ['name_en' => 'Skies of Arcadia', 'name_ar' => 'سكايز أوف أركاديا', 'category' => 'RPG', 'platform' => 'Dreamcast', 'tags' => ['rpg', 'fantasy', 'adventure'], 'size_gb' => 1.8, 'downloads' => 1700000, 'date_release' => '2000-10-05'],
            ['name_en' => 'Soulcalibur', 'name_ar' => 'سول كاليبر', 'category' => 'Fighting', 'platform' => 'Dreamcast', 'tags' => ['fighting', 'weapons', 'classic'], 'size_gb' => 0.6, 'downloads' => 2600000, 'date_release' => '1999-08-02'],
            ['name_en' => 'Persona 4 Golden', 'name_ar' => 'بيرسونا 4 غولدن', 'category' => 'RPG', 'platform' => 'PS Vita', 'tags' => ['rpg', 'story', 'life-sim'], 'size_gb' => 2.8, 'downloads' => 2800000, 'date_release' => '2012-11-15'],
            ['name_en' => 'Uncharted: Golden Abyss', 'name_ar' => 'أنشارتد: غولدن أبيس', 'category' => 'Action', 'platform' => 'PS Vita', 'tags' => ['adventure', 'action', 'portable'], 'size_gb' => 2.2, 'downloads' => 1700000, 'date_release' => '2012-02-15'],
            ['name_en' => 'Stardew Valley', 'name_ar' => 'ستاردو فالي', 'category' => 'Simulation', 'platform' => 'macOS', 'tags' => ['simulation', 'farming', 'indie'], 'size_gb' => 0.5, 'downloads' => 6500000, 'date_release' => '2016-02-26'],
            ['name_en' => 'Baldur\'s Gate 3', 'name_ar' => 'بالدرز غيت 3', 'category' => 'RPG', 'platform' => 'macOS', 'tags' => ['rpg', 'fantasy', 'tactical'], 'size_gb' => 120.0, 'downloads' => 5200000, 'date_release' => '2023-08-03'],
            ['name_en' => 'Civilization VI', 'name_ar' => 'سيفيليزيشن 6', 'category' => 'Strategy', 'platform' => 'Linux', 'tags' => ['strategy', 'turn-based', 'empire'], 'size_gb' => 8.0, 'downloads' => 3800000, 'date_release' => '2016-10-21'],
            ['name_en' => 'Hollow Knight', 'name_ar' => 'هولو نايت', 'category' => 'Adventure', 'platform' => 'Linux', 'tags' => ['adventure', 'metroidvania', 'indie'], 'size_gb' => 3.0, 'downloads' => 4200000, 'date_release' => '2017-02-24'],
            ['name_en' => 'Doom Eternal', 'name_ar' => 'دوم إيترنال', 'category' => 'Shooter', 'platform' => 'Linux', 'tags' => ['shooter', 'action', 'fast-paced'], 'size_gb' => 45.0, 'downloads' => 3200000, 'date_release' => '2020-03-20'],
        ];

        $created = [];
        foreach ($games as $game) {
            $categoryId = $categories[$game['category']] ?? null;
            $platformId = $platforms[$game['platform']] ?? null;
            if (!$categoryId || !$platformId) {
                continue;
            }
            $created[] = Game::create([
                'name_en' => $game['name_en'],
                'name_ar' => $game['name_ar'],
                'description_en' => "{$game['name_en']} is an exciting game in the {$game['category']} genre, available on {$game['platform']}.",
                'description_ar' => "{$game['name_ar']} هي لعبة مثيرة في فئة {$game['category']}، متوفرة على {$game['platform']}.",
                'category_id' => $categoryId,
                'platform_id' => $platformId,
                'tags' => $game['tags'],
                'size_gb' => $game['size_gb'],
                'downloads' => $game['downloads'],
                'date_release' => $game['date_release'],
            ]);
        }
    }
}
