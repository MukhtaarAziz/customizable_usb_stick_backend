import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserLock, faArrowRightToBracket, faBox, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm.jsx'
import PackageReceipt from '../../components/PackageReceipt/PackageReceipt.jsx'
import SuccessScreen from '../../components/SuccessScreen/SuccessScreen.jsx'
import './PackagesCheckout.css'

const langText = {
  en: {
    checkoutTitle: 'Complete your Order Info',
    checkoutDesc: 'Provide your delivery details to receive your packages.',
    customerName: 'Full Name',
    customerPhone: 'Phone Number (Iraqi Format)',
    customerEmail: 'Email Address (Optional)',
    customerGov: 'Governorate',
    customerAddress: 'Full Shipping Address',
    customerPoint: 'Nearest Famous Landmark / Service Point',
    confirmOrder: 'Confirm and Submit Order',
    receiptTitle: 'Package Order Summary',
    loginRequired: 'Login Required',
    loginPrompt: 'You need to log in or register to complete your order.',
    loginToContinue: 'Login / Register',
    govPlaceholder: '-- Select your Governorate --',
    submitLoading: 'Submitting your order...',
    invalidPhone: 'Please enter a valid Iraqi phone number (e.g. 07701234567).',
    designNew: 'Order More Packages',
    goProfile: 'Go to Profile',
    addressPlaceholder: 'e.g. Al-Mansour, 14 Ramadan Street',
    pointPlaceholder: 'e.g. Al-Mansour Mall',
    backToPackages: 'Back to Packages',
    selectPackages: 'Selected Packages',
    orderSuccess: 'Order Placed Successfully!',
    orderSuccessDesc: 'We have received your order. Our team will start preparing it shortly.',
  },
  ar: {
    checkoutTitle: 'استكمال معلومات الطلب',
    checkoutDesc: 'أدخل تفاصيل التوصيل لاستلام طلبك.',
    customerName: 'الاسم الكامل',
    customerPhone: 'رقم الهاتف (عراقي)',
    customerEmail: 'البريد الإلكتروني (اختياري)',
    customerGov: 'المحافظة',
    customerAddress: 'العنوان بالتفصيل',
    customerPoint: 'أقرب نقطة دالة / نقطة خدمة',
    confirmOrder: 'تأكيد وإرسال الطلب',
    receiptTitle: 'ملخص طلب الحزم',
    loginRequired: 'تسجيل الدخول مطلوب',
    loginPrompt: 'يجب تسجيل الدخول أو إنشاء حساب لإتمام الطلب.',
    loginToContinue: 'تسجيل الدخول / التسجيل',
    govPlaceholder: '-- اختر المحافظة --',
    submitLoading: 'جاري إرسال طلبك...',
    invalidPhone: 'يرجى إدخال رقم هاتف عراقي صحيح (مثل 07701234567).',
    designNew: 'طلب المزيد من الحزم',
    goProfile: 'الذهاب إلى الملف الشخصي',
    addressPlaceholder: 'مثال: بغداد، المنصور، شارع 14 رمضان',
    pointPlaceholder: 'مثال: قرب مول المنصور',
    backToPackages: 'العودة للحزم',
    selectPackages: 'الحزم المحددة',
    orderSuccess: 'تم إرسال الطلب بنجاح!',
    orderSuccessDesc: 'لقد استلمنا طلبك. سيبدأ فريق العمل بتجهيزه قريباً.',
  },
}

function PackagesCheckout({ locale, user, onShowAuth }) {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [governorates, setGovernorates] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    governorate_id: '',
    address: '',
    nearest_service_point: '',
    password: 'password123',
  })

  const text = langText[locale]

  useEffect(() => {
    const saved = localStorage.getItem('package_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPackages(parsed)
          return
        }
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setCheckoutForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        governorate_id: user.governorate_id || '',
        address: user.address || '',
        nearest_service_point: user.nearest_service_point || '',
        password: 'password123',
      })
    }
  }, [user])

  useEffect(() => {
    fetch('/api/governorates')
      .then(res => res.ok ? res.json() : [])
      .then(data => setGovernorates(data.data ?? data))
      .catch(() => {})
  }, [])

  const handleCheckoutFormChange = (e) => {
    const { name, value } = e.target
    setCheckoutForm(prev => ({ ...prev, [name]: value }))
  }

  const handleOrderSubmit = async (event) => {
    if (event) event.preventDefault()
    setValidationError('')

    if (!checkoutForm.name.trim()) {
      setValidationError(locale === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name')
      return
    }

    const validateIraqiPhone = (number) => {
      const cleanNumber = number.replace(/[\s-]/g, '')
      return /^(\+964|0)(770|771|772|773|790|791|792|793|794|780|781|782|783|784)\d{7}$/.test(cleanNumber)
    }

    if (!validateIraqiPhone(checkoutForm.phone)) {
      setValidationError(text.invalidPhone)
      return
    }

    if (!checkoutForm.governorate_id) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select your governorate')
      return
    }

    if (packages.length === 0) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار حزمة واحدة على الأقل' : 'Please select at least one package')
      return
    }

    setIsSubmitting(true)

    try {
      if (!user || !user.token) {
        throw new Error(locale === 'ar' ? 'يجب تسجيل الدخول أولاً.' : 'You must be logged in first.')
      }

      const orderData = {
        packages: packages.map(p => ({ id: p.id, quantity: p.quantity || 1 })),
        delivery_address: checkoutForm.address,
        phone: checkoutForm.phone,
      }

      const response = await fetch('/api/package-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || (locale === 'ar' ? 'فشل إرسال الطلب.' : 'Failed to submit order.'))
      }

      localStorage.removeItem('package_cart')
      setPackages([])
      setIsSuccess(true)
    } catch (err) {
      setValidationError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    navigate('/packages')
  }

  if (isSuccess) {
    return (
      <Container className="packages-checkout py-5">
        <Card className="border-0 shadow-sm">
          <SuccessScreen
            locale={locale}
            langText={{
              successTitle: text.orderSuccess,
              successDesc: text.orderSuccessDesc,
              designNew: text.designNew,
              goProfile: text.goProfile,
            }}
            user={user}
            onReset={handleReset}
          />
        </Card>
      </Container>
    )
  }

  return (
    <Container className="packages-checkout py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">
          <FontAwesomeIcon icon={faBox} className="me-2" />
          {locale === 'ar' ? 'إتمام طلب الحزم' : 'Package Checkout'}
        </h1>
      </div>

      <Row className="gy-4">
        <Col xs={12} lg={5}>
          <PackageReceipt packages={packages} locale={locale} langText={text} />
        </Col>

        <Col xs={12} lg={7}>
          {user ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h4 className="fw-bold mb-1">{text.checkoutTitle}</h4>
                  <p className="text-muted small">{text.checkoutDesc}</p>
                </div>

                <CheckoutForm
                  checkoutForm={checkoutForm}
                  validationError={validationError}
                  isSubmitting={isSubmitting}
                  governorates={governorates}
                  locale={locale}
                  langText={text}
                  user={user}
                  onFormChange={handleCheckoutFormChange}
                  onSubmit={handleOrderSubmit}
                  onBack={() => navigate('/packages')}
                />
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <FontAwesomeIcon icon={faUserLock} className="text-muted mb-3" style={{ fontSize: '4rem' }} />
                <h4 className="fw-bold mb-2">{text.loginRequired}</h4>
                <p className="text-muted mb-4">{text.loginPrompt}</p>
                <Button variant="primary" size="lg" onClick={onShowAuth}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className="me-2" />
                  {text.loginToContinue}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PackagesCheckout
