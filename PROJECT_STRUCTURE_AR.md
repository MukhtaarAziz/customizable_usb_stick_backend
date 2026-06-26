# 📁 هيكل مشروع Customizable USB Stick

## نظرة عامة

هذا المستودع يحتوي على تطبيق متكامل بنموذج العميل-الخادم:

```
Customizable_usb_stick/
├── 📁 backend/                    # Laravel API Backend
│   ├── app/                       # كود التطبيق الرئيسي
│   ├── config/                    # ملفات الإعدادات
│   ├── database/                  # Migrations و Seeders
│   ├── routes/                    # مسارات API
│   ├── storage/                   # تخزين الملفات والسجلات
│   ├── public/                    # الملفات العامة
│   ├── composer.json              # مكتبات PHP
│   ├── .env                       # متغيرات البيئة
│   └── artisan                    # أداة سطر الأوامر
│
├── 📁 frontend/                   # React + Bootstrap Frontend
│   ├── src/
│   │   ├── components/            # مكونات React (مستقبل)
│   │   ├── pages/                 # الصفحات (مستقبل)
│   │   ├── App.jsx                # المكون الرئيسي
│   │   ├── main.jsx               # نقطة الدخول
│   │   ├── App.css                # الأنماط
│   │   └── index.css              # الأنماط العامة
│   ├── public/                    # الملفات العامة
│   ├── node_modules/              # مكتبات JavaScript
│   ├── package.json               # مكتبات Node.js
│   ├── vite.config.js             # إعدادات Vite
│   ├── README.md                  # دليل المشروع (إنجليزي)
│   ├── README_AR.md               # دليل المشروع (عربي)
│   ├── COMPONENTS_GUIDE_AR.md     # دليل المكونات (عربي)
│   └── QUICK_START_AR.md          # نصائح البدء السريع (عربي)
│
└── README.md                      # دليل المستودع الكامل
```

## تفاصيل المشروع

### Backend (Laravel)

**المسار:** `customizable_usb_stick_backend/backend/`

**التقنيات:**
- PHP 8.3+
- Laravel 11
- MySQL/PostgreSQL
- Sanctum (للمصادقة)

**المميزات:**
- API RESTful كاملة
- نموذج قاعدة البيانات
- المصادقة والتفويض
- المعالجة الآمنة للبيانات

**الملفات المهمة:**
- `routes/api.php` - مسارات API
- `app/Http/Controllers/` - معالجات الطلبات
- `app/Models/` - نماذج قاعدة البيانات
- `database/migrations/` - ترقيات قاعدة البيانات

**الأوامر الشهيرة:**
```bash
cd backend

# تشغيل الخادم
php artisan serve

# تشغيل المهام المجدولة
php artisan schedule:work

# تشغيل المستهلكين
php artisan queue:work
```

### Frontend (React)

**المسار:** `frontend/`

**التقنيات:**
- React 19.2.7
- Vite 8.1.0
- React Bootstrap 2.10.10
- Bootstrap 5.3.8
- FontAwesome 7.2.0

**المكتبات الأساسية:**
1. **React** - مكتبة JavaScript للواجهات
2. **Vite** - أداة البناء السريعة
3. **React Bootstrap** - مكونات Bootstrap مع React
4. **Bootstrap CSS** - إطار العمل الأنيق
5. **FontAwesome** - مكتبة أيقونات شهيرة

**الملفات المهمة:**
- `src/App.jsx` - المكون الرئيسي
- `src/main.jsx` - نقطة الدخول
- `package.json` - المكتبات والإعدادات
- `vite.config.js` - إعدادات Vite

**الأوامر الشهيرة:**
```bash
cd frontend

# تشغيل خادم التطوير
npm run dev

# بناء النسخة النهائية
npm run build

# معاينة البناء
npm run preview

# فحص الكود
npm run lint
```

## الاتصال بين Frontend و Backend

### إعداد متغير البيئة

**Frontend: `.env`**
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### استدعاء API من React

```javascript
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/endpoint`
)
const data = await response.json()
```

## التثبيت الأول

### Backend (Laravel)

```bash
cd customizable_usb_stick_backend/backend

# تثبيت المكتبات
composer install

# نسخ ملف الإعدادات
cp .env.example .env

# توليد مفتاح التطبيق
php artisan key:generate

# تشغيل المهاجر
php artisan migrate

# تشغيل الخادم
php artisan serve
```

### Frontend (React)

```bash
cd frontend

# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm run dev
```

## نموذج البيانات

### المستخدمين والمصادقة
- `users` - جدول المستخدمين
- `personal_access_tokens` - رموز الدخول

### البيانات الأساسية
- `categories` - الفئات
- `platforms` - منصات الألعاب
- `games` - الألعاب
- `images` - الصور
- `governorates` - المحافظات (في العراق)

### البيانات الرئيسية
- `usb_sticks` - أجهزة USB
- `customers` - العملاء
- `packages` - الحزم

## ملفات التكوين المهمة

### Backend

**`.env`** - متغيرات البيئة
```
APP_NAME="Customizable USB Stick"
APP_URL=http://localhost:8000
DB_DATABASE=usb_stick_db
DB_USERNAME=root
```

**`config/database.php`** - إعدادات قاعدة البيانات
**`config/sanctum.php`** - إعدادات المصادقة

### Frontend

**`vite.config.js`** - إعدادات Vite
**`.env`** - متغيرات البيئة

## الخطوات التالية

### التطوير

1. **Backend:**
   - إنشاء API endpoints جديدة
   - إضافة models و migrations
   - تطبيق الحماية والصلاحيات

2. **Frontend:**
   - إنشاء صفحات ومكونات
   - الربط مع API
   - تطبيق التصميم

3. **Deployment:**
   - عمل build للـ Frontend
   - نشر على خادم الإنتاج
   - إعداد قاعدة البيانات

## موارد مفيدة

### Laravel
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Sanctum Authentication](https://laravel.com/docs/11.x/sanctum)

### React
- [React Documentation](https://react.dev)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Router](https://reactrouter.com/)

### Bootstrap & FontAwesome
- [Bootstrap Documentation](https://getbootstrap.com)
- [FontAwesome Icons](https://fontawesome.com)

## مراجع الأوامر السريعة

```bash
# تشغيل المشروع بالكامل (من مجلدات منفصلة)
cd backend && php artisan serve              # الطرفية 1
cd frontend && npm run dev                   # الطرفية 2

# بناء وحزم للإنتاج
cd backend && # (نشر عادي)
cd frontend && npm run build

# التنظيف والتنصيب
cd backend && composer install && php artisan migrate
cd frontend && npm install && npm run dev
```

## الترخيص

هذا المشروع مفتوح المصدر - يمكن استخدامه وتطويره بحرية

---

**آخر تحديث:** 2026-06-24

**نصيحة:** اقرأ ملفات README و QUICK_START في كل مجلد للمزيد من المعلومات التفصيلية!
