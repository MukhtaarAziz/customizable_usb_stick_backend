<?php

namespace Database\Seeders;

use App\Models\ProgramCategory;
use App\Models\Program;
use App\Models\ProgramPlatform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryPlatformProgramSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $categories = [
            ['category_type_id' => 2, 'name_en' => 'Office', 'name_ar' => 'أوفيس', 'description_en' => 'Office productivity and document management software.', 'description_ar' => 'برامج الإنتاجية المكتبية وإدارة المستندات.'],
            ['category_type_id' => 2, 'name_en' => 'Design', 'name_ar' => 'تصميم', 'description_en' => 'Graphic design, video editing, and creative tools.', 'description_ar' => 'أدوات التصميم الجرافيكي وتحرير الفيديو والإبداع.'],
            ['category_type_id' => 2, 'name_en' => 'Development', 'name_ar' => 'تطوير', 'description_en' => 'Programming IDEs, code editors, and development tools.', 'description_ar' => 'بيئات التطوير المتكاملة ومحررات الأكواد وأدوات التطوير.'],
            ['category_type_id' => 2, 'name_en' => 'Multimedia', 'name_ar' => 'وسائط متعددة', 'description_en' => 'Media players, converters, and streaming software.', 'description_ar' => 'مشغلات الوسائط والمحولات وبرامج البث.'],
            ['category_type_id' => 2, 'name_en' => 'Security', 'name_ar' => 'أمان', 'description_en' => 'Antivirus, encryption, and cybersecurity tools.', 'description_ar' => 'برامج مكافحة الفيروسات والتشفير والأمن السيبراني.'],
            ['category_type_id' => 2, 'name_en' => 'Utility', 'name_ar' => 'أدوات مساعدة', 'description_en' => 'System utilities, file managers, and optimization tools.', 'description_ar' => 'أدوات النظام ومديري الملفات وأدوات التحسين.'],
        ];

        $platforms = [
            ['name_en' => 'Windows', 'name_ar' => 'ويندوز', 'description_en' => 'Microsoft Windows operating system.', 'description_ar' => 'نظام تشغيل ويندوز من مايكروسوفت.'],
            ['name_en' => 'macOS', 'name_ar' => 'ماك أو إس', 'description_en' => 'Apple macOS operating system.', 'description_ar' => 'نظام تشغيل ماك أو إس من أبل.'],
            ['name_en' => 'Linux', 'name_ar' => 'لينكس', 'description_en' => 'Linux open-source operating system.', 'description_ar' => 'نظام تشغيل لينكس مفتوح المصدر.'],
            ['name_en' => 'Android', 'name_ar' => 'أندرويد', 'description_en' => 'Android mobile platform.', 'description_ar' => 'منصة أندرويد المحمولة.'],
            ['name_en' => 'IOS', 'name_ar' => 'آي أو إس', 'description_en' => 'iOS mobile platform.', 'description_ar' => 'منصة آي أو إس المحمولة.'],
            ['name_en' => 'Cross-Platform', 'name_ar' => 'متعدد المنصات', 'description_en' => 'Software available on multiple platforms.', 'description_ar' => 'برامج متوفرة على منصات متعددة.'],
        ];

        ProgramCategory::insert($categories);
        ProgramPlatform::insert($platforms);

        $officeCategory = ProgramCategory::where('name_en', 'Office')->first();
        $designCategory = ProgramCategory::where('name_en', 'Design')->first();
        $developmentCategory = ProgramCategory::where('name_en', 'Development')->first();
        $multimediaCategory = ProgramCategory::where('name_en', 'Multimedia')->first();
        $securityCategory = ProgramCategory::where('name_en', 'Security')->first();
        $utilityCategory = ProgramCategory::where('name_en', 'Utility')->first();

        $windows = ProgramPlatform::where('name_en', 'Windows')->first();
        $macos = ProgramPlatform::where('name_en', 'macOS')->first();
        $linux = ProgramPlatform::where('name_en', 'Linux')->first();
        $android = ProgramPlatform::where('name_en', 'Android')->first();
        $ios = ProgramPlatform::where('name_en', 'IOS')->first();
        $cross = ProgramPlatform::where('name_en', 'Cross-Platform')->first();

        $programs = [
            [
                'name_en' => 'Microsoft Office 2024',
                'description_en' => 'The latest productivity suite with Word, Excel, PowerPoint, and more.',
                'name_ar' => 'مايكروسوفت أوفيس 2024',
                'description_ar' => 'مجموعة الإنتاجية الأحدث مع وورد وإكسل وبوربوينت والمزيد.',
                'category_id' => $officeCategory->id,
                'program_platform_id' => $windows->id,
                'tags' => ['office', 'productivity', 'documents'],
                'size_gb' => 4.5,
                'downloads' => 5000000,
                'date_release' => '2024-10-01',
            ],
            [
                'name_en' => 'LibreOffice',
                'description_en' => 'Free and open-source office suite compatible with Microsoft formats.',
                'name_ar' => 'ليبري أوفيس',
                'description_ar' => 'مجموعة مكتبية مجانية ومفتوحة المصدر متوافقة مع صيغ مايكروسوفت.',
                'category_id' => $officeCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['office', 'free', 'open-source'],
                'size_gb' => 1.2,
                'downloads' => 2000000,
                'date_release' => '2024-02-15',
            ],
            [
                'name_en' => 'Adobe Photoshop 2025',
                'description_en' => 'Professional image editing and graphic design software.',
                'name_ar' => 'أدوبي فوتوشوب 2025',
                'description_ar' => 'برنامج احترافي لتحرير الصور والتصميم الجرافيكي.',
                'category_id' => $designCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['design', 'photo-editing', 'graphics'],
                'size_gb' => 3.8,
                'downloads' => 3000000,
                'date_release' => '2025-05-20',
            ],
            [
                'name_en' => 'Adobe Premiere Pro',
                'description_en' => 'Industry-standard video editing software for professionals.',
                'name_ar' => 'أدوبي بريمير برو',
                'description_ar' => 'برنامج تحرير الفيديو الاحترافي المعتمد في الصناعة.',
                'category_id' => $designCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['design', 'video-editing', 'professional'],
                'size_gb' => 5.2,
                'downloads' => 1500000,
                'date_release' => '2025-04-10',
            ],
            [
                'name_en' => 'Figma',
                'description_en' => 'Cloud-based UI/UX design tool for collaborative interface design.',
                'name_ar' => 'فيغما',
                'description_ar' => 'أداة تصميم واجهات تعاونية قائمة على السحابة.',
                'category_id' => $designCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['design', 'ui-ux', 'collaboration'],
                'size_gb' => 0.5,
                'downloads' => 2500000,
                'date_release' => '2024-09-15',
            ],
            [
                'name_en' => 'Visual Studio Code',
                'description_en' => 'Lightweight but powerful source code editor for all platforms.',
                'name_ar' => 'فيجوال ستوديو كود',
                'description_ar' => 'محرر أكواد خفيف وقوي لجميع المنصات.',
                'category_id' => $developmentCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['development', 'editor', 'free'],
                'size_gb' => 0.4,
                'downloads' => 8000000,
                'date_release' => '2025-01-20',
            ],
            [
                'name_en' => 'IntelliJ IDEA Ultimate',
                'description_en' => 'Powerful Java and Kotlin IDE with intelligent coding assistance.',
                'name_ar' => 'إنتيليجي أييديا ألتيميت',
                'description_ar' => 'بيئة تطوير قوية لجافا وكوتلن مع مساعدة ذكية في البرمجة.',
                'category_id' => $developmentCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['development', 'java', 'ide'],
                'size_gb' => 2.1,
                'downloads' => 1200000,
                'date_release' => '2024-11-05',
            ],
            [
                'name_en' => 'Docker Desktop',
                'description_en' => 'Containerization platform for building and deploying applications.',
                'name_ar' => 'دوكر ديسكتوب',
                'description_ar' => 'منصة الحاويات لبناء ونشر التطبيقات.',
                'category_id' => $developmentCategory->id,
                'program_platform_id' => $windows->id,
                'tags' => ['development', 'containers', 'devops'],
                'size_gb' => 1.8,
                'downloads' => 3500000,
                'date_release' => '2025-03-01',
            ],
            [
                'name_en' => 'VLC Media Player',
                'description_en' => 'Universal media player supporting virtually all formats.',
                'name_ar' => 'في إل سي ميديا بلاير',
                'description_ar' => 'مشغل وسائط عالمي يدعم جميع الصيغ تقريباً.',
                'category_id' => $multimediaCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['multimedia', 'player', 'free'],
                'size_gb' => 0.3,
                'downloads' => 10000000,
                'date_release' => '2024-12-10',
            ],
            [
                'name_en' => 'OBS Studio',
                'description_en' => 'Free and open-source software for video recording and live streaming.',
                'name_ar' => 'أو بي إس ستوديو',
                'description_ar' => 'برنامج مجاني ومفتوح المصدر لتسجيل الفيديو والبث المباشر.',
                'category_id' => $multimediaCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['multimedia', 'streaming', 'recording'],
                'size_gb' => 0.6,
                'downloads' => 4000000,
                'date_release' => '2024-08-20',
            ],
            [
                'name_en' => 'Kaspersky Internet Security',
                'description_en' => 'Comprehensive antivirus and internet security suite.',
                'name_ar' => 'كاسبرسكي إنترنت سيكيوريتي',
                'description_ar' => 'مجموعة شاملة لمكافحة الفيروسات وأمن الإنترنت.',
                'category_id' => $securityCategory->id,
                'program_platform_id' => $windows->id,
                'tags' => ['security', 'antivirus', 'protection'],
                'size_gb' => 1.5,
                'downloads' => 2500000,
                'date_release' => '2024-07-15',
            ],
            [
                'name_en' => 'Bitdefender Total Security',
                'description_en' => 'Multi-layer protection against malware, ransomware, and online threats.',
                'name_ar' => 'بتديفندر توتال سيكيوريتي',
                'description_ar' => 'حماية متعددة الطبقات ضد البرامج الضارة والفدية والتهديدات الإلكترونية.',
                'category_id' => $securityCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['security', 'antivirus', 'ransomware'],
                'size_gb' => 1.2,
                'downloads' => 1800000,
                'date_release' => '2025-02-28',
            ],
            [
                'name_en' => 'WinRAR',
                'description_en' => 'Powerful archiver and compression utility for Windows.',
                'name_ar' => 'وينرار',
                'description_ar' => 'أداة أرشفة وضغط قوية لويندوز.',
                'category_id' => $utilityCategory->id,
                'program_platform_id' => $windows->id,
                'tags' => ['utility', 'compression', 'archiver'],
                'size_gb' => 0.05,
                'downloads' => 6000000,
                'date_release' => '2024-06-01',
            ],
            [
                'name_en' => 'CCleaner',
                'description_en' => 'System optimization and privacy cleaning tool for Windows.',
                'name_ar' => 'سي كلينر',
                'description_ar' => 'أداة تحسين النظام وتنظيف الخصوصية لويندوز.',
                'category_id' => $utilityCategory->id,
                'program_platform_id' => $windows->id,
                'tags' => ['utility', 'optimization', 'cleaner'],
                'size_gb' => 0.08,
                'downloads' => 4500000,
                'date_release' => '2024-10-10',
            ],
            [
                'name_en' => '7-Zip',
                'description_en' => 'Free file archiver with high compression ratio.',
                'name_ar' => '7-زيب',
                'description_ar' => 'أداة أرشفة ملفات مجانية بنسبة ضغط عالية.',
                'category_id' => $utilityCategory->id,
                'program_platform_id' => $cross->id,
                'tags' => ['utility', 'compression', 'free'],
                'size_gb' => 0.02,
                'downloads' => 7000000,
                'date_release' => '2024-05-20',
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
