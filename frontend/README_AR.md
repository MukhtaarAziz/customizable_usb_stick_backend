# تطبيق Customizable USB Stick - Frontend

## نظرة عامة
هذا هو تطبيق الواجهة الأمامية (Frontend) لمشروع Customizable USB Stick، مبني باستخدام أحدث التقنيات في React.

## التقنيات المستخدمة

### 1. **React**
- مكتبة جافاسكريبت لبناء واجهات المستخدم
- النسخة الحالية: من خلال Vite

### 2. **Vite**
- أداة بناء سريعة للتطبيقات الحديثة
- توفر تجربة تطوير فائقة مع Hot Module Replacement (HMR)

### 3. **React Bootstrap**
- مكتبة مكونات Bootstrap مدمجة مع React
- توفر مكونات جاهزة: `Button`, `Card`, `Navbar`, `Container`, `Row`, `Col`, إلخ
- تطبيق Bootstrap CSS بشكل تلقائي

### 4. **Bootstrap CSS**
- إطار عمل CSS شهير
- توفر نمط موحد واستجابة سريعة للأجهزة المختلفة
- تصميم احترافي وجاهز للاستخدام

### 5. **FontAwesome**
- مكتبة أيقونات شهيرة وموثوقة
- حزم منفصلة:
  - `@fortawesome/react-fontawesome`: مكون React للأيقونات
  - `@fortawesome/fontawesome-svg-core`: النواة الأساسية
  - `@fortawesome/free-solid-svg-icons`: مجموعة الأيقونات الثابتة المجانية

## هيكل المشروع

```
frontend/
├── src/
│   ├── App.jsx          # المكون الرئيسي للتطبيق
│   ├── App.css          # أنماط التطبيق
│   ├── main.jsx         # نقطة الدخول للتطبيق
│   └── index.css        # الأنماط العامة
├── package.json         # مكتبات المشروع والنصوص
├── vite.config.js       # إعدادات Vite
└── README_AR.md         # هذا الملف

```

## الأيقونات المستخدمة

تم استخدام الأيقونات التالية من FontAwesome:

- `faHome` - أيقونة البيت (الرئيسية)
- `faCog` - أيقونة الإعدادات
- `faUser` - أيقونة المستخدم/الملف الشخصي
- `faHeart` - أيقونة القلب

يمكنك استخدام أيقونات إضافية من خلال استيرادها من `@fortawesome/free-solid-svg-icons`

## التثبيت والتشغيل

### متطلبات سابقة
- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn

### خطوات التثبيت

```bash
# الذهاب إلى مجلد المشروع
cd frontend

# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build
```

## المكونات الرئيسية في التطبيق

### Navbar
شريط التنقل العلوي الذي يحتوي على:
- اسم التطبيق مع أيقونة
- روابط التنقل (Profile, Settings)

### Welcome Section
قسم الترحيب يعرض معلومات عن التطبيق

### Feature Cards
ثلاث بطاقات تعرض:
- Home
- Settings
- Profile

### Counter Buttons
أزرار للعد والإعادة

## المتغيرات البيئية

يمكن إضافة متغيرات بيئية في ملف `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

## الربط مع Backend

للتواصل مع API الخاص بـ Backend في `backend/api-requests.http`، يمكنك استخدام `fetch` أو مكتبات مثل `axios`.

مثال:

```javascript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/endpoint`);
const data = await response.json();
```

## تطوير إضافي

### إضافة صفحات جديدة
1. أنشئ مكونات في مجلد `src/pages/`
2. استخدم React Router لإدارة المسارات

### إضافة مكونات مخصصة
1. أنشئ مكونات في مجلد `src/components/`
2. استيرد واستخدمها في التطبيق

### إضافة أيقونات جديدة
استيرد الأيقونات من FontAwesome:

```javascript
import { faYourIcon } from '@fortawesome/free-solid-svg-icons'
```

## الإسناد والمراجع

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [FontAwesome Documentation](https://fontawesome.com/docs)

## الترخيص

هذا المشروع مرخص تحت [حدد الترخيص]

---

تم الإنشاء بواسطة Copilot
