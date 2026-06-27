<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Game Categories (category_type_id = 1)
            ['category_type_id' => 1, 'name_en' => 'Action', 'name_ar' => 'أكشن', 'description_en' => 'Fast-paced action games with combat and adventure.', 'description_ar' => 'ألعاب أكشن سريعة مع قتال ومغامرة.'],
            ['category_type_id' => 1, 'name_en' => 'Racing', 'name_ar' => 'سباق', 'description_en' => 'High-speed racing and driving simulation games.', 'description_ar' => 'ألعاب سباق ومحاكاة القيادة بسرعات عالية.'],
            ['category_type_id' => 1, 'name_en' => 'Sports', 'name_ar' => 'رياضة', 'description_en' => 'Sports and athletic simulation games.', 'description_ar' => 'ألعاب رياضية ومحاكاة الأداء الرياضي.'],
            ['category_type_id' => 1, 'name_en' => 'RPG', 'name_ar' => 'تقمص أدوار', 'description_en' => 'Role-playing games with story and character progression.', 'description_ar' => 'ألعاب تقمص الأدوار بقصة وتطور الشخصية.'],
            ['category_type_id' => 1, 'name_en' => 'Shooter', 'name_ar' => 'إطلاق نار', 'description_en' => 'First-person and third-person shooter games.', 'description_ar' => 'ألعاب إطلاق نار من منظور شخص أول وثالث.'],
            ['category_type_id' => 1, 'name_en' => 'Adventure', 'name_ar' => 'مغامرة', 'description_en' => 'Exploration and puzzle-solving adventure games.', 'description_ar' => 'ألعاب مغامرة باستكشاف وحل الألغاز.'],
            ['category_type_id' => 1, 'name_en' => 'Fighting', 'name_ar' => 'قتال', 'description_en' => 'One-on-one combat and martial arts games.', 'description_ar' => 'ألعاب قتال فردي وفنون قتالية.'],
            ['category_type_id' => 1, 'name_en' => 'Strategy', 'name_ar' => 'استراتيجية', 'description_en' => 'Tactical and strategic planning games.', 'description_ar' => 'ألعاب تكتيكية وتخطيط استراتيجي.'],
            ['category_type_id' => 1, 'name_en' => 'Horror', 'name_ar' => 'رعب', 'description_en' => 'Scary and suspenseful horror games.', 'description_ar' => 'ألعاب رعب مرعبة ومليئة بالتشويق.'],
            ['category_type_id' => 1, 'name_en' => 'Puzzle', 'name_ar' => 'ألغاز', 'description_en' => 'Brain-teasing puzzle and logic games.', 'description_ar' => 'ألعاب ألغاز ومنطق لتحدي الدماغ.'],
            ['category_type_id' => 1, 'name_en' => 'Simulation', 'name_ar' => 'محاكاة', 'description_en' => 'Life and vehicle simulation games.', 'description_ar' => 'ألعاب محاكاة الحياة والمركبات.'],
            ['category_type_id' => 1, 'name_en' => 'Platformer', 'name_ar' => 'منصات', 'description_en' => 'Classic platform jumping games.', 'description_ar' => 'ألعاب منصات كلاسيكية بالقفز.'],
            ['category_type_id' => 1, 'name_en' => 'Stealth', 'name_ar' => 'تخفي', 'description_en' => 'Stealth and espionage games.', 'description_ar' => 'ألعاب التخفي والتجسس.'],
            ['category_type_id' => 1, 'name_en' => 'Open World', 'name_ar' => 'عالم مفتوح', 'description_en' => 'Open-world exploration games.', 'description_ar' => 'ألعاب استكشاف العالم المفتوح.'],
            ['category_type_id' => 1, 'name_en' => 'Battle Royale', 'name_ar' => 'باتل رويال', 'description_en' => 'Last-player-standing multiplayer games.', 'description_ar' => 'ألعاب لاعبين متعددين البقاء الأخير.'],
            ['category_type_id' => 1, 'name_en' => 'Indie', 'name_ar' => 'مستقلة', 'description_en' => 'Independent games from small studios.', 'description_ar' => 'ألعاب مستقلة من استوديوهات صغيرة.'],
            ['category_type_id' => 1, 'name_en' => 'Arcade', 'name_ar' => 'أركيد', 'description_en' => 'Classic arcade-style games.', 'description_ar' => 'ألعاب كلاسيكية بأسلوب الأركيد.'],
            ['category_type_id' => 1, 'name_en' => 'Survival', 'name_ar' => 'بقاء', 'description_en' => 'Survival and crafting games.', 'description_ar' => 'ألعاب البقاء والصناعة.'],
            ['category_type_id' => 1, 'name_en' => 'MMORPG', 'name_ar' => 'MMORPG', 'description_en' => 'Massively multiplayer online RPG games.', 'description_ar' => 'ألعاب تقمص أدوار ضخمة متعددة اللاعبين.'],
            ['category_type_id' => 1, 'name_en' => 'Casual', 'name_ar' => 'عادية', 'description_en' => 'Casual and easy-to-play games.', 'description_ar' => 'ألعاب عادية وسهلة اللعب.'],

            // Program Categories (category_type_id = 2)
            ['category_type_id' => 2, 'name_en' => 'Audio and Music', 'name_ar' => 'صوتيات وموسيقى', 'description_en' => 'Audio editing, music production, and sound tools.', 'description_ar' => 'برامج تحرير الصوت وإنتاج الموسيقى والأدوات الصوتية.'],
            ['category_type_id' => 2, 'name_en' => 'Video Editing', 'name_ar' => 'مونتاج فيديو', 'description_en' => 'Video editing and production software.', 'description_ar' => 'برامج تحرير وإنتاج الفيديو.'],
            ['category_type_id' => 2, 'name_en' => 'Photo Editing', 'name_ar' => 'تحرير صور', 'description_en' => 'Image editing and graphic design software.', 'description_ar' => 'برامج تحرير الصور والتصميم الجرافيكي.'],
            ['category_type_id' => 2, 'name_en' => 'Office Suite', 'name_ar' => 'مكتبية', 'description_en' => 'Word processing, spreadsheets, and office tools.', 'description_ar' => 'برامج معالجة النصوص والجداول الحسابية وأدوات مكتبية.'],
            ['category_type_id' => 2, 'name_en' => 'Antivirus', 'name_ar' => 'مضاد فيروسات', 'description_en' => 'Security and antivirus protection software.', 'description_ar' => 'برامج الحماية ومكافحة الفيروسات.'],
            ['category_type_id' => 2, 'name_en' => 'Internet and Network', 'name_ar' => 'إنترنت وشبكات', 'description_en' => 'Browsers, download managers, and network tools.', 'description_ar' => 'المتصفحات ومديري التنزيل وأدوات الشبكة.'],
            ['category_type_id' => 2, 'name_en' => 'System Tools', 'name_ar' => 'أدوات النظام', 'description_en' => 'System optimization and maintenance utilities.', 'description_ar' => 'برامج تحسين وصيانة النظام.'],
            ['category_type_id' => 2, 'name_en' => 'Programming', 'name_ar' => 'برمجة', 'description_en' => 'IDEs, code editors, and development tools.', 'description_ar' => 'بيئات التطوير ومحررات الأكواد وأدوات البرمجة.'],
            ['category_type_id' => 2, 'name_en' => 'Database', 'name_ar' => 'قواعد بيانات', 'description_en' => 'Database management and administration tools.', 'description_ar' => 'برامج إدارة وإدارة قواعد البيانات.'],
            ['category_type_id' => 2, 'name_en' => 'File Compression', 'name_ar' => 'ضغط ملفات', 'description_en' => 'File compression and archiving software.', 'description_ar' => 'برامج ضغط وأرشفة الملفات.'],
            ['category_type_id' => 2, 'name_en' => 'Communication', 'name_ar' => 'تواصل', 'description_en' => 'Messaging, video calls, and communication apps.', 'description_ar' => 'تطبيقات المراسلة والمكالمات المرئية والتواصل.'],
            ['category_type_id' => 2, 'name_en' => 'Download Manager', 'name_ar' => 'مدير تنزيل', 'description_en' => 'Download acceleration and management tools.', 'description_ar' => 'أدوات تسريع وإدارة التنزيلات.'],
            ['category_type_id' => 2, 'name_en' => 'Media Player', 'name_ar' => 'مشغل وسائط', 'description_en' => 'Video and audio media players.', 'description_ar' => 'مشغلات الوسائط الصوتية والمرئية.'],
            ['category_type_id' => 2, 'name_en' => '3D and CAD', 'name_ar' => 'تصميم ثلاثي الأبعاد', 'description_en' => '3D modeling and CAD design software.', 'description_ar' => 'برامج النمذجة ثلاثية الأبعاد وتصميم CAD.'],
            ['category_type_id' => 2, 'name_en' => 'Education', 'name_ar' => 'تعليم', 'description_en' => 'Educational and learning software.', 'description_ar' => 'برامج تعليمية وتعلمية.'],
            ['category_type_id' => 2, 'name_en' => 'Business', 'name_ar' => 'أعمال', 'description_en' => 'Business management and accounting software.', 'description_ar' => 'برامج إدارة الأعمال والمحاسبة.'],
            ['category_type_id' => 2, 'name_en' => 'Utilities', 'name_ar' => 'أدوات مساعدة', 'description_en' => 'General utility and helper tools.', 'description_ar' => 'أدوات مساعدة عامة.'],
            ['category_type_id' => 2, 'name_en' => 'Development', 'name_ar' => 'تطوير', 'description_en' => 'Web and software development tools.', 'description_ar' => 'أدوات تطوير الويب والبرمجيات.'],
            ['category_type_id' => 2, 'name_en' => 'Graphics Design', 'name_ar' => 'تصميم جرافيكي', 'description_en' => 'Graphic design and illustration software.', 'description_ar' => 'برامج التصميم الجرافيكي والرسوم.'],
            ['category_type_id' => 2, 'name_en' => 'Emulators', 'name_ar' => 'محاكيات', 'description_en' => 'Gaming console and system emulators.', 'description_ar' => 'محاكيات أجهزة الألعاب والأنظمة.'],
        ];

        DB::table('categories')->insert($categories);
    }
}