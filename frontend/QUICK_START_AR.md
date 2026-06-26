# 🚀 نصائح البدء السريع

## 1️⃣ تشغيل المشروع

```bash
# الذهاب إلى مجلد frontend
cd frontend

# تشغيل خادم التطوير
npm run dev
```

سيظهر URL مثل: `http://localhost:5173/`

## 2️⃣ فتح المشروع في VS Code

```bash
# من مجلد المستودع الرئيسي
code .
```

## 3️⃣ الملفات الأساسية

- **`src/App.jsx`** - المكون الرئيسي (ابدأ من هنا)
- **`src/main.jsx`** - نقطة الدخول للتطبيق
- **`package.json`** - المكتبات والإعدادات
- **`vite.config.js`** - إعدادات Vite

## 4️⃣ إضافة مكونات جديدة

### إنشاء مجلد للمكونات

```bash
mkdir src/components
```

### مثال: إنشاء مكون جديد

**`src/components/Header.jsx`**

```javascript
import { Navbar, Container, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMenu } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">تطبيقي</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#">الرئيسية</Nav.Link>
            <Nav.Link href="#">حول</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
```

### استخدام المكون الجديد

**`src/App.jsx`**

```javascript
import Header from './components/Header'

function App() {
  return (
    <>
      <Header />
      {/* باقي المحتوى */}
    </>
  )
}

export default App
```

## 5️⃣ الربط مع Backend

### إنشاء ملف للـ API

**`src/api/api.js`**

```javascript
const API_BASE_URL = 'http://localhost:8000/api'

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`)
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

### استخدام البيانات من API

```javascript
import { useEffect, useState } from 'react'
import { fetchData } from './api/api'

function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData('products').then(result => {
      setData(result)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>جاري التحميل...</div>

  return (
    <div>
      {data && data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}

export default MyComponent
```

## 6️⃣ تثبيت مكتبات إضافية

```bash
# أمثلة على مكتبات مشهورة:

# React Router (للملاحة بين الصفحات)
npm install react-router-dom

# Axios (للطلبات HTTP)
npm install axios

# Redux (إدارة الحالة)
npm install @reduxjs/toolkit react-redux

# Tailwind CSS (أداة CSS)
npm install -D tailwindcss postcss autoprefixer
```

## 7️⃣ الأوامر المهمة

```bash
# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview

# فحص الكود
npm run lint
```

## 8️⃣ مشاكل شائعة والحلول

### المشكلة: Bootstrap غير يعمل
**الحل:** تأكد من استيراد CSS:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
```

### المشكلة: FontAwesome أيقونات لا تظهر
**الحل:** تأكد من الاستيراد الصحيح:
```javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
```

### المشكلة: المشروع لا يعمل بعد التثبيت
**الحل:**
```bash
# حذف node_modules والمثبت
rm -r node_modules package-lock.json

# إعادة التثبيت
npm install
```

## 9️⃣ موارد مفيدة

- 📖 [توثيق React](https://react.dev/)
- 📖 [توثيق React Bootstrap](https://react-bootstrap.github.io/)
- 📖 [توثيق Bootstrap](https://getbootstrap.com/docs/5.3/)
- 🎨 [FontAwesome Icons](https://fontawesome.com/icons)
- ⚡ [Vite Documentation](https://vite.dev/)

## 🔟 الخطوات التالية

1. ✅ تثبيت المكتبات (تم)
2. 🚀 تشغيل الخادم: `npm run dev`
3. 📝 تحديث `src/App.jsx` بمكونات خاصة بك
4. 🔗 الربط مع Backend API
5. 🎨 تخصيص الأنماط والألوان
6. 📦 بناء النسخة النهائية: `npm run build`

---

**ملاحظة:** كل الملفات مع البيانات توجد في هذا المشروع. يمكنك البدء بالتطوير مباشرة!

تم آخر تحديث: 2026-06-24
