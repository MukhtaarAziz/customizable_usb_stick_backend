<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\ProgramPackage;
use App\Models\ProgramPlatform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramPackagesSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $windows = ProgramPlatform::where('name_en', 'Windows')->first();
        $macos = ProgramPlatform::where('name_en', 'macOS')->first();
        $cross = ProgramPlatform::where('name_en', 'Cross-Platform')->first();

        if (!$windows || !$macos || !$cross) {
            return;
        }

        $packages = [
            [
                'name_en' => 'Adobe Creative Suite',
                'name_ar' => 'مجموعة أدوبي الإبداعية',
                'description_en' => 'Complete collection of Adobe creative tools including Photoshop, Premiere Pro, and more.',
                'description_ar' => 'مجموعة متكاملة من أدوات أدوبي الإبداعية تشمل فوتوشوب وبريمير برو والمزيد.',
                'program_platform_id' => $cross->id,
            ],
            [
                'name_en' => 'Microsoft Office Bundle',
                'name_ar' => 'حزمة مايكروسوفت أوفيس',
                'description_en' => 'Full Microsoft Office suite with Word, Excel, PowerPoint, and Outlook.',
                'description_ar' => 'مجموعة مايكروسوفت أوفيس الكاملة مع وورد وإكسل وبوربوينت وأوتلوك.',
                'program_platform_id' => $windows->id,
            ],
            [
                'name_en' => 'Developer Essentials',
                'name_ar' => 'أساسيات المطور',
                'description_en' => 'Essential tools for developers including VS Code, Docker, and Git clients.',
                'description_ar' => 'أدوات أساسية للمطورين تشمل فيجوال ستوديو كود ودوكر وعملاء جيت.',
                'program_platform_id' => $cross->id,
            ],
            [
                'name_en' => 'Security Suite Pro',
                'name_ar' => 'حزمة الأمان المحترفة',
                'description_en' => 'Complete security package with antivirus, VPN, and password manager.',
                'description_ar' => 'حزمة أمان كاملة مع مضاد فيروسات وشبكة افتراضية خاصة ومدير كلمات مرور.',
                'program_platform_id' => $windows->id,
            ],
            [
                'name_en' => 'Mac Creativity Pack',
                'name_ar' => 'حزمة الإبداع لماك',
                'description_en' => 'Curated collection of creative and multimedia tools for macOS.',
                'description_ar' => 'مجموعة منتقاة من أدوات الإبداع والوسائط المتعددة لنظام ماك.',
                'program_platform_id' => $macos->id,
            ],
        ];

        foreach ($packages as $packageData) {
            $package = ProgramPackage::create([
                'name_en' => $packageData['name_en'],
                'name_ar' => $packageData['name_ar'],
                'description_en' => $packageData['description_en'],
                'description_ar' => $packageData['description_ar'],
                'cover_id' => null,
                'program_platform_id' => $packageData['program_platform_id'],
                'views' => rand(0, 500),
                'order_count' => rand(0, 100),
            ]);

            $programs = Program::inRandomOrder()->take(rand(2, 4))->get();
            $package->programs()->sync($programs->pluck('id')->all());
        }
    }
}
