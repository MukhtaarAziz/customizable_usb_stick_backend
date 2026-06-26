# دليل استخدام المكتبات

## قائمة بالمكتبات المثبتة والإصدارات

```json
{
  "react": "^19.2.7",
  "react-dom": "^19.2.7",
  "react-bootstrap": "^2.10.10",
  "bootstrap": "^5.3.8",
  "@fortawesome/react-fontawesome": "^3.3.1",
  "@fortawesome/fontawesome-svg-core": "^6.7.1",
  "@fortawesome/free-solid-svg-icons": "^6.7.1"
}
```

## مكونات React Bootstrap الشهيرة

### 1. الملاحة والتخطيط
- `Navbar` - شريط التنقل
- `Nav` - عنصر التنقل
- `Container` - حاوية رئيسية
- `Row` - صف في الشبكة
- `Col` - عمود في الشبكة

### 2. النماذج والإدخال
- `Form` - نموذج
- `Form.Group` - مجموعة في النموذج
- `Form.Label` - تسمية
- `Form.Control` - حقل إدخال
- `Button` - زر
- `InputGroup` - مجموعة إدخال

### 3. المحتوى
- `Card` - بطاقة
- `Accordion` - قائمة قابلة للطي
- `Alert` - تنبيه
- `Badge` - شارة
- `Pagination` - ترقيم الصفحات
- `Breadcrumb` - مسار الملاحة

### 4. النوافذ المنبثقة والرسائل
- `Modal` - نافذة منبثقة
- `Toast` - رسالة منبثقة
- `Popover` - تلميح منبثقة
- `Tooltip` - تلميح

### 5. الجداول
- `Table` - جدول بيانات

### 6. أخرى
- `Spinner` - مؤشر تحميل
- `Dropdown` - قائمة منسدلة
- `ListGroup` - قائمة مجموعات
- `Tab` - علامات تبويب

## أمثلة الاستخدام

### مثال: استخدام Button

```javascript
import { Button } from 'react-bootstrap'

function MyComponent() {
  return (
    <Button variant="primary" size="lg">
      انقر هنا
    </Button>
  )
}
```

### مثال: استخدام Card

```javascript
import { Card } from 'react-bootstrap'

function MyCard() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>عنوان البطاقة</Card.Title>
        <Card.Text>محتوى البطاقة</Card.Text>
      </Card.Body>
    </Card>
  )
}
```

### مثال: استخدام Form

```javascript
import { Form, Button } from 'react-bootstrap'

function MyForm() {
  return (
    <Form>
      <Form.Group>
        <Form.Label>البريد الإلكتروني</Form.Label>
        <Form.Control type="email" placeholder="أدخل بريدك الإلكتروني" />
      </Form.Group>
      <Button variant="primary" type="submit">
        إرسال
      </Button>
    </Form>
  )
}
```

## خصائص مكونات Bootstrap الشهيرة

### Button - الخصائص الشهيرة

```javascript
<Button 
  variant="primary"        // اللون: primary, secondary, success, danger, warning, info, light, dark
  size="lg"               // الحجم: lg, sm
  disabled={false}        // تعطيل الزر
  onClick={handleClick}   // دالة عند الضغط
  className="me-2"        // marginEnd = 2
>
  نص الزر
</Button>
```

### Card - الخصائص الشهيرة

```javascript
<Card className="shadow-sm">
  <Card.Header>الرأس</Card.Header>
  <Card.Body>
    <Card.Title>العنوان</Card.Title>
    <Card.Text>النص</Card.Text>
  </Card.Body>
  <Card.Footer>التذييل</Card.Footer>
</Card>
```

### Col - الخصائص الشهيرة

```javascript
<Col 
  xs={12}      // كامل العرض على الأجهزة الصغيرة
  sm={6}       // نصف العرض على الأجهزة الصغيرة والمتوسطة
  md={4}       // ثلث العرض على الأجهزة المتوسطة
  lg={3}       // ربع العرض على الأجهزة الكبيرة
>
  محتوى العمود
</Col>
```

## أيقونات FontAwesome الشهيرة

### الأيقونات الأساسية

```javascript
import { 
  faHome,
  faCog,
  faUser,
  faBell,
  faHeart,
  faStar,
  faSearch,
  faEye,
  faEyeSlash,
  faLock,
  faUnlock,
  faTrash,
  faEdit,
  faPlus,
  faMinus,
  faCheck,
  faTimes,
  faChevronDown,
  faChevronUp,
  faArrowLeft,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// الاستخدام
<FontAwesomeIcon icon={faHome} />
<FontAwesomeIcon icon={faCog} size="2x" />
<FontAwesomeIcon icon={faHeart} className="text-danger" />
```

## Utility Classes في Bootstrap

### الهوامش
- `m-1, m-2, m-3, m-4, m-5` - margin
- `mt-1, mb-1, ml-1, mr-1` - margin top, bottom, left, right
- `mx-auto` - margin horizontal auto (توسيط)

### الحشوة
- `p-1, p-2, p-3, p-4, p-5` - padding
- `pt-1, pb-1, pl-1, pr-1` - padding top, bottom, left, right

### الألوان
- `text-primary, text-success, text-danger, text-warning, text-info`
- `bg-primary, bg-light, bg-dark`

### الأحجام والعرض
- `w-100` - عرض 100%
- `h-100` - ارتفاع 100%
- `d-flex` - عرض flex
- `justify-content-center` - توسيط أفقي
- `align-items-center` - توسيط عمودي

## نصائح وأفضل الممارسات

1. **استخدم الشبكة بشكل صحيح**: استخدم `Container`, `Row`, `Col` لإنشاء تخطيط مستجيب
2. **استخدم الألوان بحكمة**: استخدم متغيرات Bootstrap للألوان الموحدة
3. **أضف أيقونات بجانب النصوص**: اجعل الواجهة أكثر وضوحاً
4. **استخدم الفراغات بشكل صحيح**: استخدم Utility Classes للهوامش والحشوة
5. **اختبر على أجهزة مختلفة**: استخدم breakpoints المختلفة في Bootstrap

---

تم آخر تحديث: 2026-06-24
