<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\ProgramCategory;
use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramsTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ProgramCategory::pluck('id', 'name_en');
        $platforms = Platform::pluck('id', 'name_en');

        $programs = [
            ['name_en' => 'Adobe Photoshop 2025', 'name_ar' => 'أدوبي فوتوشوب 2025', 'category' => 'Photo Editing', 'platform' => 'Windows', 'tags' => ['design', 'photo-editing', 'graphics'], 'size_mb' => 3.8, 'downloads' => 3000000, 'date_release' => '2025-05-20'],
            ['name_en' => 'Adobe Premiere Pro', 'name_ar' => 'أدوبي بريمير برو', 'category' => 'Video Editing', 'platform' => 'Windows', 'tags' => ['video-editing', 'professional', 'production'], 'size_mb' => 5.2, 'downloads' => 1500000, 'date_release' => '2025-04-10'],
            ['name_en' => 'Adobe After Effects', 'name_ar' => 'أدوبي أفتر إفكتس', 'category' => 'Video Editing', 'platform' => 'Windows', 'tags' => ['motion-graphics', 'vfx', 'animation'], 'size_mb' => 4.5, 'downloads' => 1200000, 'date_release' => '2025-03-15'],
            ['name_en' => 'Adobe Illustrator', 'name_ar' => 'أدوبي إلستريتور', 'category' => 'Graphics Design', 'platform' => 'Windows', 'tags' => ['vector', 'design', 'illustration'], 'size_mb' => 2.5, 'downloads' => 2500000, 'date_release' => '2025-04-01'],
            ['name_en' => 'Adobe Lightroom', 'name_ar' => 'أدوبي لايتورم', 'category' => 'Photo Editing', 'platform' => 'Windows', 'tags' => ['photo-editing', 'raw', 'photography'], 'size_mb' => 1.5, 'downloads' => 2200000, 'date_release' => '2025-02-10'],
            ['name_en' => 'Adobe InDesign', 'name_ar' => 'أدوبي إن ديزاين', 'category' => 'Graphics Design', 'platform' => 'Windows', 'tags' => ['layout', 'publishing', 'design'], 'size_mb' => 2.0, 'downloads' => 1800000, 'date_release' => '2024-11-20'],
            ['name_en' => 'Microsoft Office 2024', 'name_ar' => 'مايكروسوفت أوفيس 2024', 'category' => 'Office Suite', 'platform' => 'Windows', 'tags' => ['office', 'productivity', 'documents'], 'size_mb' => 4.5, 'downloads' => 5000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Microsoft Word', 'name_ar' => 'مايكروسوفت وورد', 'category' => 'Office Suite', 'platform' => 'Windows', 'tags' => ['word-processing', 'documents', 'office'], 'size_mb' => 1.2, 'downloads' => 8000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Microsoft Excel', 'name_ar' => 'مايكروسوفت إكسل', 'category' => 'Office Suite', 'platform' => 'Windows', 'tags' => ['spreadsheet', 'data', 'office'], 'size_mb' => 1.5, 'downloads' => 7500000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Microsoft PowerPoint', 'name_ar' => 'مايكروسوفت بوربوينت', 'category' => 'Office Suite', 'platform' => 'Windows', 'tags' => ['presentation', 'slides', 'office'], 'size_mb' => 1.0, 'downloads' => 7000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Microsoft Access', 'name_ar' => 'مايكروسوفت أكسس', 'category' => 'Database', 'platform' => 'Windows', 'tags' => ['database', 'management', 'office'], 'size_mb' => 0.8, 'downloads' => 1200000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Microsoft Outlook', 'name_ar' => 'مايكروسوفت أوتلوك', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['email', 'calendar', 'office'], 'size_mb' => 0.9, 'downloads' => 5500000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Visual Studio Code', 'name_ar' => 'فيجوال ستوديو كود', 'category' => 'Programming', 'platform' => 'Windows', 'tags' => ['editor', 'development', 'free'], 'size_mb' => 0.4, 'downloads' => 8000000, 'date_release' => '2025-01-20'],
            ['name_en' => 'Visual Studio 2025', 'name_ar' => 'فيجوال ستوديو 2025', 'category' => 'Programming', 'platform' => 'Windows', 'tags' => ['ide', 'development', 'microsoft'], 'size_mb' => 6.5, 'downloads' => 3200000, 'date_release' => '2025-03-15'],
            ['name_en' => 'IntelliJ IDEA Ultimate', 'name_ar' => 'إنتيليجي أييديا ألتيميت', 'category' => 'Programming', 'platform' => 'Windows', 'tags' => ['ide', 'java', 'development'], 'size_mb' => 2.1, 'downloads' => 1200000, 'date_release' => '2024-11-05'],
            ['name_en' => 'PyCharm Professional', 'name_ar' => 'بايثارم بروفيشنال', 'category' => 'Programming', 'platform' => 'Windows', 'tags' => ['ide', 'python', 'development'], 'size_mb' => 1.8, 'downloads' => 980000, 'date_release' => '2024-11-05'],
            ['name_en' => 'WebStorm', 'name_ar' => 'ويب ستورم', 'category' => 'Programming', 'platform' => 'Windows', 'tags' => ['ide', 'javascript', 'web'], 'size_mb' => 1.5, 'downloads' => 750000, 'date_release' => '2024-11-05'],
            ['name_en' => 'GitHub Desktop', 'name_ar' => 'جيت هاب ديسكتوب', 'category' => 'Development', 'platform' => 'Windows', 'tags' => ['git', 'version-control', 'github'], 'size_mb' => 0.3, 'downloads' => 4500000, 'date_release' => '2024-08-15'],
            ['name_en' => 'Docker Desktop', 'name_ar' => 'دوكر ديسكتوب', 'category' => 'Development', 'platform' => 'Windows', 'tags' => ['containers', 'devops', 'development'], 'size_mb' => 1.8, 'downloads' => 3500000, 'date_release' => '2025-03-01'],
            ['name_en' => 'Postman', 'name_ar' => 'بوستمان', 'category' => 'Development', 'platform' => 'Windows', 'tags' => ['api', 'testing', 'development'], 'size_mb' => 0.6, 'downloads' => 2800000, 'date_release' => '2024-12-01'],
            ['name_en' => 'MySQL Workbench', 'name_ar' => 'MySQL وورك بنش', 'category' => 'Database', 'platform' => 'Windows', 'tags' => ['database', 'mysql', 'management'], 'size_mb' => 0.5, 'downloads' => 2200000, 'date_release' => '2024-06-15'],
            ['name_en' => 'pgAdmin 4', 'name_ar' => 'pgAdmin 4', 'category' => 'Database', 'platform' => 'Windows', 'tags' => ['database', 'postgresql', 'management'], 'size_mb' => 0.4, 'downloads' => 1800000, 'date_release' => '2024-04-10'],
            ['name_en' => 'SQL Server Management Studio', 'name_ar' => 'SQL إس إم إس', 'category' => 'Database', 'platform' => 'Windows', 'tags' => ['database', 'sql-server', 'management'], 'size_mb' => 1.2, 'downloads' => 2500000, 'date_release' => '2024-07-20'],
            ['name_en' => 'MongoDB Compass', 'name_ar' => 'مونغو دي بي كومباس', 'category' => 'Database', 'platform' => 'Windows', 'tags' => ['database', 'mongodb', 'nosql'], 'size_mb' => 0.5, 'downloads' => 1500000, 'date_release' => '2024-09-01'],
            ['name_en' => 'WinRAR', 'name_ar' => 'وينرار', 'category' => 'File Compression', 'platform' => 'Windows', 'tags' => ['compression', 'archiver', 'utility'], 'size_mb' => 0.05, 'downloads' => 6000000, 'date_release' => '2024-06-01'],
            ['name_en' => '7-Zip', 'name_ar' => '7-زيب', 'category' => 'File Compression', 'platform' => 'Windows', 'tags' => ['compression', 'free', 'utility'], 'size_mb' => 0.02, 'downloads' => 7000000, 'date_release' => '2024-05-20'],
            ['name_en' => 'WinZip', 'name_ar' => 'وين زيب', 'category' => 'File Compression', 'platform' => 'Windows', 'tags' => ['compression', 'archiver', 'utility'], 'size_mb' => 0.08, 'downloads' => 3500000, 'date_release' => '2024-08-10'],
            ['name_en' => 'Kaspersky Internet Security', 'name_ar' => 'كاسبرسكي إنترنت سيكيوريتي', 'category' => 'Antivirus', 'platform' => 'Windows', 'tags' => ['security', 'antivirus', 'protection'], 'size_mb' => 1.5, 'downloads' => 2500000, 'date_release' => '2024-07-15'],
            ['name_en' => 'Bitdefender Total Security', 'name_ar' => 'بتديفندر توتال سيكيوريتي', 'category' => 'Antivirus', 'platform' => 'Windows', 'tags' => ['security', 'antivirus', 'ransomware'], 'size_mb' => 1.2, 'downloads' => 1800000, 'date_release' => '2025-02-28'],
            ['name_en' => 'Norton 360', 'name_ar' => 'نورتن 360', 'category' => 'Antivirus', 'platform' => 'Windows', 'tags' => ['security', 'antivirus', 'vpn'], 'size_mb' => 0.8, 'downloads' => 3200000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Malwarebytes', 'name_ar' => 'مالوير بايتس', 'category' => 'Antivirus', 'platform' => 'Windows', 'tags' => ['security', 'antimalware', 'protection'], 'size_mb' => 0.3, 'downloads' => 4000000, 'date_release' => '2024-11-01'],
            ['name_en' => 'Avast Free Antivirus', 'name_ar' => 'أفاست مضاد الفيروسات', 'category' => 'Antivirus', 'platform' => 'Windows', 'tags' => ['security', 'antivirus', 'free'], 'size_mb' => 0.6, 'downloads' => 5500000, 'date_release' => '2024-10-20'],
            ['name_en' => 'CCleaner', 'name_ar' => 'سي كلينر', 'category' => 'System Tools', 'platform' => 'Windows', 'tags' => ['utility', 'optimization', 'cleaner'], 'size_mb' => 0.08, 'downloads' => 4500000, 'date_release' => '2024-10-10'],
            ['name_en' => 'Speccy', 'name_ar' => 'سبيكي', 'category' => 'System Tools', 'platform' => 'Windows', 'tags' => ['system-info', 'hardware', 'utility'], 'size_mb' => 0.02, 'downloads' => 2000000, 'date_release' => '2024-06-01'],
            ['name_en' => 'Defraggler', 'name_ar' => 'ديفراغلر', 'category' => 'System Tools', 'platform' => 'Windows', 'tags' => ['defrag', 'utility', 'optimization'], 'size_mb' => 0.03, 'downloads' => 1500000, 'date_release' => '2024-05-15'],
            ['name_en' => 'Recuva', 'name_ar' => 'ريكيوفا', 'category' => 'System Tools', 'platform' => 'Windows', 'tags' => ['recovery', 'utility', 'data'], 'size_mb' => 0.04, 'downloads' => 2500000, 'date_release' => '2024-07-01'],
            ['name_en' => 'VLC Media Player', 'name_ar' => 'في إل سي ميديا بلاير', 'category' => 'Media Player', 'platform' => 'Windows', 'tags' => ['multimedia', 'player', 'free'], 'size_mb' => 0.3, 'downloads' => 10000000, 'date_release' => '2024-12-10'],
            ['name_en' => 'OBS Studio', 'name_ar' => 'أو بي إس ستوديو', 'category' => 'Video Editing', 'platform' => 'Windows', 'tags' => ['streaming', 'recording', 'video'], 'size_mb' => 0.6, 'downloads' => 4000000, 'date_release' => '2024-08-20'],
            ['name_en' => 'Audacity', 'name_ar' => 'أوداسيتي', 'category' => 'Audio and Music', 'platform' => 'Windows', 'tags' => ['audio', 'editing', 'free'], 'size_mb' => 0.1, 'downloads' => 6000000, 'date_release' => '2024-09-15'],
            ['name_en' => 'FL Studio', 'name_ar' => 'إف إل ستوديو', 'category' => 'Audio and Music', 'platform' => 'Windows', 'tags' => ['music', 'production', 'daw'], 'size_mb' => 1.5, 'downloads' => 2200000, 'date_release' => '2025-01-10'],
            ['name_en' => 'Ableton Live 12', 'name_ar' => 'أبلتون ليف 12', 'category' => 'Audio and Music', 'platform' => 'Windows', 'tags' => ['music', 'production', 'daw'], 'size_mb' => 3.0, 'downloads' => 1800000, 'date_release' => '2024-03-15'],
            ['name_en' => 'Google Chrome', 'name_ar' => 'جوجل كروم', 'category' => 'Internet and Network', 'platform' => 'Windows', 'tags' => ['browser', 'web', 'google'], 'size_mb' => 0.2, 'downloads' => 15000000, 'date_release' => '2024-12-01'],
            ['name_en' => 'Mozilla Firefox', 'name_ar' => 'موزيلا فايرفوكس', 'category' => 'Internet and Network', 'platform' => 'Windows', 'tags' => ['browser', 'web', 'privacy'], 'size_mb' => 0.3, 'downloads' => 8000000, 'date_release' => '2024-11-15'],
            ['name_en' => 'Internet Download Manager', 'name_ar' => 'مدير تنزيل', 'category' => 'Download Manager', 'platform' => 'Windows', 'tags' => ['downloader', 'accelerator', 'utility'], 'size_mb' => 0.05, 'downloads' => 5000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'qBittorrent', 'name_ar' => 'كي بتورنت', 'category' => 'Download Manager', 'platform' => 'Windows', 'tags' => ['torrent', 'downloader', 'free'], 'size_mb' => 0.08, 'downloads' => 3500000, 'date_release' => '2024-09-20'],
            ['name_en' => 'Discord', 'name_ar' => 'ديسكورد', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['chat', 'voice', 'gaming'], 'size_mb' => 0.4, 'downloads' => 9000000, 'date_release' => '2024-07-15'],
            ['name_en' => 'Slack', 'name_ar' => 'سلاك', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['chat', 'team', 'productivity'], 'size_mb' => 0.5, 'downloads' => 4000000, 'date_release' => '2024-06-01'],
            ['name_en' => 'Telegram Desktop', 'name_ar' => 'تيليغرام ديسكتوب', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['messaging', 'secure', 'cloud'], 'size_mb' => 0.2, 'downloads' => 5500000, 'date_release' => '2024-10-05'],
            ['name_en' => 'Skype', 'name_ar' => 'سكايب', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['video-calls', 'messaging', 'microsoft'], 'size_mb' => 0.3, 'downloads' => 6000000, 'date_release' => '2024-08-20'],
            ['name_en' => 'Zoom', 'name_ar' => 'زووم', 'category' => 'Communication', 'platform' => 'Windows', 'tags' => ['video-conference', 'meetings', 'remote'], 'size_mb' => 0.2, 'downloads' => 12000000, 'date_release' => '2024-09-01'],
            ['name_en' => 'Blender', 'name_ar' => 'بلندر', 'category' => '3D and CAD', 'platform' => 'Windows', 'tags' => ['3d', 'modeling', 'animation'], 'size_mb' => 0.6, 'downloads' => 3500000, 'date_release' => '2024-11-20'],
            ['name_en' => 'AutoCAD 2025', 'name_ar' => 'أوتوكاد 2025', 'category' => '3D and CAD', 'platform' => 'Windows', 'tags' => ['cad', 'drafting', 'design'], 'size_mb' => 4.0, 'downloads' => 2800000, 'date_release' => '2025-03-20'],
            ['name_en' => 'Fusion 360', 'name_ar' => 'فيوجن 360', 'category' => '3D and CAD', 'platform' => 'Windows', 'tags' => ['cad', 'cam', '3d-printing'], 'size_mb' => 2.5, 'downloads' => 1500000, 'date_release' => '2024-12-01'],
            ['name_en' => 'SolidWorks 2025', 'name_ar' => 'سوليدووركس 2025', 'category' => '3D and CAD', 'platform' => 'Windows', 'tags' => ['cad', 'engineering', 'design'], 'size_mb' => 8.0, 'downloads' => 1200000, 'date_release' => '2025-02-01'],
            ['name_en' => 'SketchUp Pro', 'name_ar' => 'سكتش أب برو', 'category' => '3D and CAD', 'platform' => 'Windows', 'tags' => ['3d', 'modeling', 'architecture'], 'size_mb' => 0.8, 'downloads' => 2000000, 'date_release' => '2024-10-15'],
            ['name_en' => 'Duolingo', 'name_ar' => 'دولينجو', 'category' => 'Education', 'platform' => 'Windows', 'tags' => ['language', 'learning', 'free'], 'size_mb' => 0.2, 'downloads' => 8000000, 'date_release' => '2024-06-10'],
            ['name_en' => 'Khan Academy', 'name_ar' => 'خان أكاديمي', 'category' => 'Education', 'platform' => 'Windows', 'tags' => ['learning', 'education', 'free'], 'size_mb' => 0.1, 'downloads' => 5000000, 'date_release' => '2024-04-01'],
            ['name_en' => 'Quizlet', 'name_ar' => 'كويزلت', 'category' => 'Education', 'platform' => 'Windows', 'tags' => ['study', 'flashcards', 'learning'], 'size_mb' => 0.1, 'downloads' => 3500000, 'date_release' => '2024-07-20'],
            ['name_en' => 'QuickBooks Desktop', 'name_ar' => 'كويك بوكس ديسكتوب', 'category' => 'Business', 'platform' => 'Windows', 'tags' => ['accounting', 'business', 'finance'], 'size_mb' => 2.0, 'downloads' => 1800000, 'date_release' => '2024-11-01'],
            ['name_en' => 'Sage 50', 'name_ar' => 'سيج 50', 'category' => 'Business', 'platform' => 'Windows', 'tags' => ['accounting', 'business', 'finance'], 'size_mb' => 1.5, 'downloads' => 1200000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Power BI Desktop', 'name_ar' => 'باور بي آي ديسكتوب', 'category' => 'Business', 'platform' => 'Windows', 'tags' => ['analytics', 'business', 'visualization'], 'size_mb' => 0.6, 'downloads' => 2500000, 'date_release' => '2025-01-15'],
            ['name_en' => 'Notepad++', 'name_ar' => 'نوت باد++', 'category' => 'Utilities', 'platform' => 'Windows', 'tags' => ['editor', 'text', 'utility'], 'size_mb' => 0.01, 'downloads' => 9000000, 'date_release' => '2024-08-01'],
            ['name_en' => 'Everything', 'name_ar' => 'إيفري ثينج', 'category' => 'Utilities', 'platform' => 'Windows', 'tags' => ['search', 'file', 'utility'], 'size_mb' => 0.02, 'downloads' => 4000000, 'date_release' => '2024-05-10'],
            ['name_en' => 'Greenshot', 'name_ar' => 'جرين شوت', 'category' => 'Utilities', 'platform' => 'Windows', 'tags' => ['screenshot', 'utility', 'annotation'], 'size_mb' => 0.01, 'downloads' => 3000000, 'date_release' => '2024-06-15'],
            ['name_en' => 'Paint.NET', 'name_ar' => 'بينت دوت نت', 'category' => 'Photo Editing', 'platform' => 'Windows', 'tags' => ['photo-editing', 'free', 'windows'], 'size_mb' => 0.2, 'downloads' => 4500000, 'date_release' => '2024-10-01'],
            ['name_en' => 'GIMP', 'name_ar' => 'جيمب', 'category' => 'Photo Editing', 'platform' => 'Windows', 'tags' => ['photo-editing', 'free', 'open-source'], 'size_mb' => 0.4, 'downloads' => 3800000, 'date_release' => '2024-11-05'],
            ['name_en' => 'Inkscape', 'name_ar' => 'إنكسكيب', 'category' => 'Graphics Design', 'platform' => 'Windows', 'tags' => ['vector', 'design', 'free'], 'size_mb' => 0.3, 'downloads' => 2500000, 'date_release' => '2024-09-20'],
            ['name_en' => 'Canva Desktop', 'name_ar' => 'كانفا ديسكتوب', 'category' => 'Graphics Design', 'platform' => 'Windows', 'tags' => ['design', 'template', 'online'], 'size_mb' => 0.4, 'downloads' => 6000000, 'date_release' => '2024-12-01'],
            ['name_en' => 'Figma', 'name_ar' => 'فيغما', 'category' => 'Graphics Design', 'platform' => 'Windows', 'tags' => ['ui-ux', 'design', 'collaboration'], 'size_mb' => 0.5, 'downloads' => 2500000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Dolphin Emulator', 'name_ar' => 'دولفين إميوليتور', 'category' => 'Emulators', 'platform' => 'Windows', 'tags' => ['emulator', 'gamecube', 'wii'], 'size_mb' => 0.2, 'downloads' => 2000000, 'date_release' => '2024-07-10'],
            ['name_en' => 'PCSX2', 'name_ar' => 'PCSX2', 'category' => 'Emulators', 'platform' => 'Windows', 'tags' => ['emulator', 'ps2', 'gaming'], 'size_mb' => 0.3, 'downloads' => 1800000, 'date_release' => '2024-06-01'],
            ['name_en' => 'RPCS3', 'name_ar' => 'RPCS3', 'category' => 'Emulators', 'platform' => 'Windows', 'tags' => ['emulator', 'ps3', 'gaming'], 'size_mb' => 0.4, 'downloads' => 1200000, 'date_release' => '2024-08-20'],
            ['name_en' => 'Yuzu', 'name_ar' => 'يوزو', 'category' => 'Emulators', 'platform' => 'Windows', 'tags' => ['emulator', 'switch', 'gaming'], 'size_mb' => 0.3, 'downloads' => 2500000, 'date_release' => '2024-09-01'],
            ['name_en' => 'Cemu', 'name_ar' => 'سيمو', 'category' => 'Emulators', 'platform' => 'Windows', 'tags' => ['emulator', 'wii-u', 'gaming'], 'size_mb' => 0.2, 'downloads' => 900000, 'date_release' => '2024-05-15'],
            ['name_en' => 'Android Studio', 'name_ar' => 'أندرويد ستوديو', 'category' => 'Development', 'platform' => 'Windows', 'tags' => ['android', 'development', 'ide'], 'size_mb' => 3.5, 'downloads' => 3000000, 'date_release' => '2024-12-10'],
            ['name_en' => 'Xcode', 'name_ar' => 'إكس كود', 'category' => 'Development', 'platform' => 'macOS', 'tags' => ['ios', 'development', 'apple'], 'size_mb' => 8.0, 'downloads' => 2500000, 'date_release' => '2025-01-15'],
            ['name_en' => 'Final Cut Pro', 'name_ar' => 'فاينال كت برو', 'category' => 'Video Editing', 'platform' => 'macOS', 'tags' => ['video-editing', 'apple', 'professional'], 'size_mb' => 3.2, 'downloads' => 1800000, 'date_release' => '2024-11-20'],
            ['name_en' => 'Logic Pro', 'name_ar' => 'لوجيك برو', 'category' => 'Audio and Music', 'platform' => 'macOS', 'tags' => ['music', 'production', 'apple'], 'size_mb' => 6.5, 'downloads' => 1200000, 'date_release' => '2024-10-15'],
            ['name_en' => 'GarageBand', 'name_ar' => 'قيرج باند', 'category' => 'Audio and Music', 'platform' => 'macOS', 'tags' => ['music', 'production', 'free'], 'size_mb' => 1.5, 'downloads' => 3500000, 'date_release' => '2024-09-01'],
            ['name_en' => 'Safari', 'name_ar' => 'سفاري', 'category' => 'Internet and Network', 'platform' => 'macOS', 'tags' => ['browser', 'web', 'apple'], 'size_mb' => 0.1, 'downloads' => 8000000, 'date_release' => '2024-12-01'],
            ['name_en' => 'Pages', 'name_ar' => 'بيجز', 'category' => 'Office Suite', 'platform' => 'macOS', 'tags' => ['word-processing', 'apple', 'documents'], 'size_mb' => 0.6, 'downloads' => 3000000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Numbers', 'name_ar' => 'نامبرز', 'category' => 'Office Suite', 'platform' => 'macOS', 'tags' => ['spreadsheet', 'apple', 'data'], 'size_mb' => 0.7, 'downloads' => 2800000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Keynote', 'name_ar' => 'كي نوت', 'category' => 'Office Suite', 'platform' => 'macOS', 'tags' => ['presentation', 'apple', 'slides'], 'size_mb' => 0.8, 'downloads' => 2600000, 'date_release' => '2024-09-15'],
            ['name_en' => 'Alfred', 'name_ar' => 'ألفريد', 'category' => 'Utilities', 'platform' => 'macOS', 'tags' => ['launcher', 'productivity', 'mac'], 'size_mb' => 0.04, 'downloads' => 2000000, 'date_release' => '2024-11-01'],
            ['name_en' => 'LibreOffice', 'name_ar' => 'ليبري أوفيس', 'category' => 'Office Suite', 'platform' => 'Linux', 'tags' => ['office', 'free', 'open-source'], 'size_mb' => 1.2, 'downloads' => 2000000, 'date_release' => '2024-02-15'],
            ['name_en' => 'GCC', 'name_ar' => 'مجمّع جي سي سي', 'category' => 'Development', 'platform' => 'Linux', 'tags' => ['compiler', 'c', 'development'], 'size_mb' => 0.5, 'downloads' => 3000000, 'date_release' => '2024-06-01'],
            ['name_en' => 'Python', 'name_ar' => 'بايثون', 'category' => 'Development', 'platform' => 'Linux', 'tags' => ['language', 'programming', 'interpreter'], 'size_mb' => 0.2, 'downloads' => 12000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Node.js', 'name_ar' => 'نود.جي إس', 'category' => 'Development', 'platform' => 'Linux', 'tags' => ['javascript', 'runtime', 'backend'], 'size_mb' => 0.08, 'downloads' => 8000000, 'date_release' => '2025-04-15'],
            ['name_en' => 'GIMP', 'name_ar' => 'جيمب', 'category' => 'Photo Editing', 'platform' => 'Linux', 'tags' => ['photo-editing', 'free', 'open-source'], 'size_mb' => 0.4, 'downloads' => 1500000, 'date_release' => '2024-11-05'],
            ['name_en' => 'Audacity', 'name_ar' => 'أوداسيتي', 'category' => 'Audio and Music', 'platform' => 'Linux', 'tags' => ['audio', 'editing', 'free'], 'size_mb' => 0.1, 'downloads' => 2000000, 'date_release' => '2024-09-15'],
            ['name_en' => 'WhatsApp Desktop', 'name_ar' => 'واتساب ديسكتوب', 'category' => 'Communication', 'platform' => 'Android', 'tags' => ['messaging', 'secure', 'meta'], 'size_mb' => 0.2, 'downloads' => 15000000, 'date_release' => '2024-12-01'],
            ['name_en' => 'Instagram', 'name_ar' => 'إنستغرام', 'category' => 'Communication', 'platform' => 'Android', 'tags' => ['social', 'photos', 'sharing'], 'size_mb' => 0.4, 'downloads' => 25000000, 'date_release' => '2024-11-01'],
            ['name_en' => 'Snapseed', 'name_ar' => 'سنابسيد', 'category' => 'Photo Editing', 'platform' => 'Android', 'tags' => ['photo-editing', 'mobile', 'google'], 'size_mb' => 0.1, 'downloads' => 12000000, 'date_release' => '2024-08-15'],
            ['name_en' => 'CapCut', 'name_ar' => 'كاب كت', 'category' => 'Video Editing', 'platform' => 'Android', 'tags' => ['video-editing', 'mobile', 'free'], 'size_mb' => 0.3, 'downloads' => 20000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'Grammarly Keyboard', 'name_ar' => 'جرامرلي كيبورد', 'category' => 'Utilities', 'platform' => 'Android', 'tags' => ['writing', 'grammar', 'keyboard'], 'size_mb' => 0.2, 'downloads' => 8000000, 'date_release' => '2024-09-01'],
            ['name_en' => 'Google Drive', 'name_ar' => 'جوجل درايف', 'category' => 'Office Suite', 'platform' => 'Android', 'tags' => ['cloud', 'storage', 'google'], 'size_mb' => 0.1, 'downloads' => 20000000, 'date_release' => '2024-11-15'],
            ['name_en' => 'TikTok', 'name_ar' => 'تيك توك', 'category' => 'Communication', 'platform' => 'iOS', 'tags' => ['social', 'video', 'sharing'], 'size_mb' => 0.5, 'downloads' => 30000000, 'date_release' => '2024-10-01'],
            ['name_en' => 'iMovie', 'name_ar' => 'آي موفي', 'category' => 'Video Editing', 'platform' => 'iOS', 'tags' => ['video-editing', 'apple', 'free'], 'size_mb' => 0.6, 'downloads' => 5000000, 'date_release' => '2024-09-15'],
            ['name_en' => 'GarageBand iOS', 'name_ar' => 'قيرج باند iOS', 'category' => 'Audio and Music', 'platform' => 'iOS', 'tags' => ['music', 'production', 'apple'], 'size_mb' => 1.2, 'downloads' => 4000000, 'date_release' => '2024-09-01'],
            ['name_en' => 'Procreate', 'name_ar' => 'بروكرييت', 'category' => 'Graphics Design', 'platform' => 'iOS', 'tags' => ['drawing', 'art', 'ipad'], 'size_mb' => 0.3, 'downloads' => 6000000, 'date_release' => '2024-11-01'],
        ];

        foreach ($programs as $program) {
            $categoryId = $categories[$program['category']] ?? null;
            $platformId = $platforms[$program['platform']] ?? null;
            if (!$categoryId || !$platformId) {
                continue;
            }
            Program::create([
                'name_en' => $program['name_en'],
                'name_ar' => $program['name_ar'],
                'description_en' => "{$program['name_en']} is a professional {$program['category']} application available on {$program['platform']}.",
                'description_ar' => "{$program['name_ar']} هو تطبيق {$program['category']} احترافي متوفر على {$program['platform']}.",
                'category_id' => $categoryId,
                'platform_id' => $platformId,
                'tags' => $program['tags'],
                'size_mb' => $program['size_mb'],
                'downloads' => $program['downloads'],
                'date_release' => $program['date_release'],
            ]);
        }
    }
}
