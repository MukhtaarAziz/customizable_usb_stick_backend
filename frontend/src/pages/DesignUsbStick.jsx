import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowRight, 
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import DesignStepper from '../components/DesignStepper/DesignStepper.jsx'
import UsbSelectionGrid from '../components/UsbSelectionGrid/UsbSelectionGrid.jsx'
import GamesCatalog from '../components/GamesCatalog/GamesCatalog.jsx'
import CheckoutForm from '../components/CheckoutForm/CheckoutForm.jsx'
import OrderReceipt from '../components/OrderReceipt/OrderReceipt.jsx'
import SuccessScreen from '../components/SuccessScreen/SuccessScreen.jsx'
import GameDetailsModal from '../components/GameDetailsModal/GameDetailsModal.jsx'
import UsbStickPreview from '../components/UsbStickPreview/UsbStickPreview.jsx'
import UsbDetailsModal from '../components/UsbDetailsModal/UsbDetailsModal.jsx'
import './DesignUsbStick.css'

const stepsText = {
  en: {
    step1: 'Select USB',
    step2: 'Choose Games',
    step3: 'Checkout Info',
    step4: 'Done',
    selectUsbTitle: 'Step 1: Choose your USB Flash Drive',
    selectUsbDesc: 'Select the storage size and interface type that suits your needs.',
    chooseGamesTitle: 'Step 2: Choose your Games & Fill USB',
    chooseGamesDesc: 'Browse the catalog and add games to fill your selected capacity.',
    checkoutTitle: 'Step 3: Complete your Order Info',
    checkoutDesc: 'Provide your shipping address and contact details to receive your customized USB.',
    successTitle: 'Order Placed Successfully!',
    successDesc: 'We have received your customization order. Our team will start preparing your USB stick shortly.',
    estTimeLabel: 'Estimated Copy Time',
    basePrice: 'USB Base Price',
    totalSize: 'Total Games Size',
    freeSpace: 'Available Free Space',
    exceedWarn: 'Storage limit exceeded! Please remove some games.',
    customerName: 'Full Name',
    customerPhone: 'Phone Number (Iraqi Format)',
    customerEmail: 'Email Address (Optional)',
    customerGov: 'Governorate',
    customerAddress: 'Full Shipping Address',
    customerPoint: 'Nearest Famous Landmark / Service Point',
    confirmOrder: 'Confirm and Submit Order',
    backToGames: 'Back to Games Selection',
    backToUsb: 'Back to USB Selection',
    nextSelectGames: 'Next: Select Games',
    nextCheckout: 'Next: Shipping Info',
    gamesList: 'Selected Games',
    noGamesSelected: 'No games added yet.',
    emptyStick: 'Please select a USB stick from Step 1 to begin.',
    stickLabel: 'Selected USB Stick',
    govPlaceholder: '-- Select your Governorate --',
    submitLoading: 'Submitting your order...',
    invalidPhone: 'Please enter a valid Iraqi phone number (e.g. 07701234567, 07801234567, 07501234567).',
    designNew: 'Design Another USB',
    goProfile: 'Go to Profile',
    addressPlaceholder: 'e.g. Al-Mansour, 14 Ramadan Street, near Al-Ruwad intersection',
    pointPlaceholder: 'e.g. Al-Mansour Mall, or Korek main branch',
    receiptTitle: 'Order Invoice Summary',
    capacityUsed: 'Capacity Used',
  },
  ar: {
    step1: 'اختر الفلاش',
    step2: 'اختر الألعاب',
    step3: 'بيانات الطلب',
    step4: 'تم بنجاح',
    selectUsbTitle: 'الخطوة 1: اختر فلاش ميموري USB المناسب لك',
    selectUsbDesc: 'حدد سعة التخزين ونوع المنفذ الذي يناسب احتياجاتك.',
    chooseGamesTitle: 'الخطوة 2: اختر الألعاب واملأ الفلاش',
    chooseGamesDesc: 'تصفح قائمة الألعاب المتاحة وأضفها لملء المساحة المتاحة.',
    checkoutTitle: 'الخطوة 3: استكمال معلومات التوصيل والطلب',
    checkoutDesc: 'أدخل تفاصيل العنوان ورقم الهاتف لاستلام طلبك المخصص.',
    successTitle: 'تم إرسال الطلب بنجاح!',
    successDesc: 'لقد استلمنا طلب تخصيص الفلاشة الخاص بك. سيبدأ فريق العمل بنسخ الألعاب وتجهيز الطلب قريباً.',
    estTimeLabel: 'وقت النسخ المقدر',
    basePrice: 'سعر الفلاش الأساسي',
    totalSize: 'إجمالي حجم الألعاب',
    freeSpace: 'المساحة المتبقية بالفلاش',
    exceedWarn: 'لقد تجاوزت المساحة المتاحة بالفلاش! يرجى إزالة بعض الألعاب.',
    customerName: 'الاسم الكامل',
    customerPhone: 'رقم الهاتف (عراقي)',
    customerEmail: 'البريد الإلكتروني (اختياري)',
    customerGov: 'المحافظة',
    customerAddress: 'العنوان بالتفصيل',
    customerPoint: 'أقرب نقطة دالة / نقطة خدمة',
    confirmOrder: 'تأكيد وإرسال الطلب',
    backToGames: 'العودة لاختيار الألعاب',
    backToUsb: 'العودة لاختيار الفلاش',
    nextSelectGames: 'التالي: اختيار الألعاب',
    nextCheckout: 'التالي: معلومات الشحن',
    gamesList: 'الألعاب المضافة',
    noGamesSelected: 'لم يتم إضافة ألعاب بعد.',
    emptyStick: 'يرجى تحديد فلاش USB من الخطوة الأولى للبدء.',
    stickLabel: 'الفلاش المحدد',
    govPlaceholder: '-- اختر المحافظة --',
    submitLoading: 'جاري إرسال طلبك...',
    invalidPhone: 'يرجى إدخال رقم هاتف عراقي صحيح (مثل 07701234567 أو 07801234567 أو 07501234567).',
    designNew: 'تصميم فلاشة جديدة',
    goProfile: 'الذهاب إلى الملف الشخصي',
    addressPlaceholder: 'مثال: بغداد، المنصور، شارع 14 رمضان، قرب تقاطع الرواد',
    pointPlaceholder: 'مثال: قرب مول المنصور أو مركز كورك الرئيسي',
    receiptTitle: 'ملخص فاتورة الطلب',
    capacityUsed: 'السعة المستخدمة',
  }
}

function DesignUsbStick({
  locale,
  user,
  selectedUsbId,
  setSelectedUsbId,
  selectedGames,
  setSelectedGames,
  showUsbModal,
  setShowUsbModal,
  activeStep,
  setActiveStep
}) {
  
  // Data State
  const [usbSticks, setUsbSticks] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [categories, setCategories] = useState([])
  const [games, setGames] = useState([])
  const [governorates, setGovernorates] = useState([])
  
  // Loading & Error States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Selection States
  const [viewMode, setViewMode] = useState('grid')
  const [search, setSearch] = useState('')
  const [platformId, setPlatformId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [perPage, setPerPage] = useState(12)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 })
  const [showGameDetails, setShowGameDetails] = useState(false)
  const [currentGame, setCurrentGame] = useState(null)

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    governorate_id: '',
    address: '',
    nearest_service_point: '',
    password: 'password123'
  })
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedUsb = usbSticks.find((usb) => String(usb.id) === String(selectedUsbId))
  const selectedGameIds = selectedGames.map((game) => game.id)
  
  const totalGamesSize = selectedGames.reduce((acc, game) => acc + (Number(game.size_gb) || 0), 0)
  const isOverCapacity = selectedUsb && totalGamesSize > Number(selectedUsb.size_gb)
  const langText = stepsText[locale]

  // Pre-fill checkout form if user is logged in
  useEffect(() => {
    if (user) {
      setCheckoutForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        governorate_id: user.governorate_id || '',
        address: user.address || '',
        nearest_service_point: user.nearest_service_point || '',
        password: 'password123'
      })
    }
  }, [user])

  // Load USBs, platforms, categories, governorates on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [usbRes, platRes, catRes, govRes] = await Promise.all([
          fetch('/api/usb-sticks'),
          fetch('/api/platforms'),
          fetch('/api/categories'),
          fetch('/api/governorates')
        ])

        if (usbRes.ok) {
          const data = await usbRes.json()
          setUsbSticks(data.data ?? data)
        }
        if (platRes.ok) {
          const data = await platRes.json()
          setPlatforms(data.data ?? data)
        }
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(data.data ?? data)
        }
        if (govRes.ok) {
          const data = await govRes.json()
          setGovernorates(data.data ?? data)
        }
      } catch (err) {
        console.error('Error fetching meta info:', err)
      }
    }

    loadMeta()
  }, [])

  // Load games with search/filter parameters
  useEffect(() => {
    async function loadGames() {
      setLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams()
        query.set('per_page', perPage)
        query.set('page', page)
        if (search) query.set('search', search)
        if (platformId) query.set('platform_id', platformId)
        if (categoryId) query.set('category_id', categoryId)

        const response = await fetch(`/api/games?${query.toString()}`)
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل الألعاب.' : 'Unable to load games.')
        }

        const data = await response.json()
        setGames(data.data ?? data)
        setMeta(data.meta ?? {
          current_page: data.current_page ?? 1,
          last_page: data.last_page ?? 1,
        })
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الألعاب.' : 'Something went wrong while loading games.'))
      } finally {
        setLoading(false)
      }
    }

    if (selectedUsbId) {
      loadGames()
    } else {
      setGames([])
      setMeta({ current_page: 1, last_page: 1 })
      setLoading(false)
    }
  }, [locale, search, platformId, categoryId, page, perPage, selectedUsbId])

  const handleUsbChange = (usbId) => {
    setSelectedUsbId(usbId)
    setSelectedGames([])
    setPage(1)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handlePlatformChange = (event) => {
    setPlatformId(event.target.value)
    setPage(1)
  }

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value)
    setPage(1)
  }

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value))
    setPage(1)
  }

  const handleAddGame = (game) => {
    setSelectedGames((prev) => {
      if (prev.some((item) => item.id === game.id)) return prev
      return [...prev, game]
    })
  }

  const handleRemoveGame = (gameId) => {
    setSelectedGames((prev) => prev.filter((game) => game.id !== gameId))
  }

  const handleViewGameDetails = (game) => {
    setCurrentGame(game)
    setShowGameDetails(true)
  }

  const handleCheckoutFormChange = (e) => {
    const { name, value } = e.target
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Checkout order submission
  const handleOrderSubmit = async (event) => {
    if (event) {
      event.preventDefault()
    }
    setValidationError('')
    
    // Validations
    if (!checkoutForm.name.trim()) {
      setValidationError(locale === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name')
      return
    }
    
    const validateIraqiPhone = (number) => {
      const cleanNumber = number.replace(/[\s-]/g, '')
      const pattern = /^(\+964|0)(770|771|772|773|790|791|792|793|794|780|781|782|783|784)\d{7}$/
      return pattern.test(cleanNumber)
    }
    
    if (!validateIraqiPhone(checkoutForm.phone)) {
      setValidationError(langText.invalidPhone)
      return
    }
    if (!checkoutForm.governorate_id) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select your governorate')
      return
    }
    if (!selectedUsbId) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار فلاش USB' : 'Please select a USB stick')
      return
    }
    if (selectedGames.length === 0) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار لعبة واحدة على الأقل' : 'Please select at least one game')
      return
    }

    setIsSubmitting(true)

    try {
      let authToken = null

      // If customer is not logged in, try to login first, then register if needed
      if (!user || !user.token) {
        // Try to login first (in case account already exists)
        let loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: checkoutForm.email || checkoutForm.phone,
            password: checkoutForm.password
          })
        })

        // If login succeeds, use the token
        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          authToken = loginData.token
        } else {
          // Login failed, try to register new account
          const registerResponse = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(checkoutForm)
          })

          if (!registerResponse.ok) {
            const errorData = await registerResponse.json()
            throw new Error(errorData.message || (locale === 'ar' ? 'فشل إنشاء الحساب.' : 'Failed to create account.'))
          }

          // Auto-login after successful registration
          loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: checkoutForm.email,
              password: checkoutForm.password
            })
          })

          if (!loginResponse.ok) {
            throw new Error(locale === 'ar' ? 'فشل تسجيل الدخول التلقائي.' : 'Failed to auto-login.')
          }

          const loginData = await loginResponse.json()
          authToken = loginData.token
        }
      } else {
        // User is logged in, use existing token
        authToken = user.token
      }

      // Create custom USB order
      const orderData = {
        usb_stick_id: parseInt(selectedUsbId),
        game_ids: selectedGameIds,
        notes: checkoutForm.notes || null,
        custom_message: checkoutForm.custom_message || null,
        delivery_address: checkoutForm.address,
        phone: checkoutForm.phone
      }

      const orderResponse = await fetch('/api/custom-usb-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        throw new Error(locale === 'ar' ? 'فشل إرسال الطلب.' : 'Failed to submit order.')
      }

      // Success - move to success screen
      setActiveStep(4)
    } catch (err) {
      setValidationError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetWizard = () => {
    setSelectedUsbId('')
    setSelectedGames([])
    setActiveStep(1)
    setValidationError('')
  }

  return (
    <Container className="design-usb py-5">
      
      {/* Header Banner */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">{locale === 'ar' ? 'صمم USB الخاص بك' : 'Design Your USB Stick'}</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          {locale === 'ar'
            ? 'قم ببناء فلاش ميموري مخصص بألعابك المفضلة بخطوات بسيطة ومرنة.'
            : 'Build a customized flash memory with your favorite games in simple and flexible steps.'}
        </p>
      </div>

      {/* Stepper */}
      <DesignStepper activeStep={activeStep} locale={locale} langText={langText} />

      {/* ================= STEP 1: SELECT USB ================= */}
      {activeStep === 1 && (
        <Card className="design-usb__card shadow-sm border-0">
          <div className="mb-4">
            <h4 className="fw-bold mb-1">{langText.selectUsbTitle}</h4>
            <p className="text-muted small">{langText.selectUsbDesc}</p>
          </div>

          <UsbSelectionGrid
            usbSticks={usbSticks}
            selectedUsbId={selectedUsbId}
            onSelect={handleUsbChange}
            locale={locale}
          />

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="primary"
              disabled={!selectedUsbId}
              onClick={() => setActiveStep(2)}
              className="wizard-btn-next"
            >
              <span className="wizard-btn-text">{langText.nextSelectGames}</span>
              <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} />
            </Button>
          </div>
        </Card>
      )}

      {/* ================= STEP 2: BROWSE AND SELECT GAMES ================= */}
      {activeStep === 2 && (
        <Row className="gy-4">
          <Col xs={12}>
            <div className="mb-4">
              <h4 className="fw-bold mb-1">{langText.chooseGamesTitle}</h4>
              <p className="text-muted small">{langText.chooseGamesDesc}</p>
            </div>

            <GamesCatalog
              games={games}
              loading={loading}
              error={error}
              search={search}
              platformId={platformId}
              categoryId={categoryId}
              perPage={perPage}
              page={page}
              meta={meta}
              platforms={platforms}
              categories={categories}
              viewMode={viewMode}
              selectedGameIds={selectedGameIds}
              onSearchChange={handleSearchChange}
              onPlatformChange={handlePlatformChange}
              onCategoryChange={handleCategoryChange}
              onPerPageChange={handlePerPageChange}
              onPageChange={setPage}
              onViewModeChange={setViewMode}
              onViewGameDetails={handleViewGameDetails}
              onAddGame={handleAddGame}
              locale={locale}
            />

            {/* Stepper buttons */}
            <div className="wizard-nav-buttons">
              <Button 
                variant="outline-secondary" 
                className="wizard-btn-back text-start rtl-float"
                onClick={() => setActiveStep(1)}
              >
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowRight : faArrowLeft} />
                <span className="wizard-btn-text">{langText.backToUsb}</span>
              </Button>

              <Button 
                variant="primary" 
                className="wizard-btn-next text-end rtl-float"
                disabled={selectedGames.length === 0 || isOverCapacity}
                onClick={() => setActiveStep(3)}
              >
                <span className="wizard-btn-text">{langText.nextCheckout}</span>
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} />
              </Button>
            </div>

            {/* Floating Action Button for Desktop/Tablet - Now Positioned Absolutely */}
            <Button 
              variant="primary" 
              className="design-usb__floating-action d-none d-md-flex align-items-center justify-content-center position-fixed bottom-0 end-0 m-4 shadow-lg rounded-3"
              onClick={() => setShowUsbModal(true)}
              aria-label={locale === 'ar' ? 'تفاصيل الفلاش' : 'USB Details'}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 7V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V7" />
                <rect x="6" y="7" width="12" height="14" rx="2.5" />
                <circle cx="12" cy="17" r="1.2" fill="currentColor" />
                <line x1="9" y1="11" x2="15" y2="11" strokeWidth="1.5" opacity="0.6" />
              </svg>
              <span className={locale === 'ar' ? 'me-2' : 'ms-2'}>{locale === 'ar' ? 'التفاصيل والمتابعة' : 'Details & Next'}</span>
              {selectedGames.length > 0 && (
                <Badge bg="light" text="primary" pill className={locale === 'ar' ? 'me-2 fs-6' : 'ms-2 fs-6'}>
                  {selectedGames.length}
                </Badge>
              )}
            </Button>
          </Col>
        </Row>
      )}

      {/* ================= STEP 3: CUSTOMER SHIPPING INFO & INVOICE RECEIPT ================= */}
      {activeStep === 3 && (
        <Row className="gy-4">
          {/* Checkout Form */}
          <Col xs={12} lg={7}>
            <Card className="design-usb__card border-0 shadow-sm">
              <div className="mb-4">
                <h4 className="fw-bold mb-1">{langText.checkoutTitle}</h4>
                <p className="text-muted small">{langText.checkoutDesc}</p>
              </div>

              <CheckoutForm
                checkoutForm={checkoutForm}
                validationError={validationError}
                isSubmitting={isSubmitting}
                governorates={governorates}
                locale={locale}
                langText={langText}
                user={user}
                onFormChange={handleCheckoutFormChange}
                onSubmit={handleOrderSubmit}
                onBack={() => setActiveStep(2)}
              />
            </Card>
          </Col>

          {/* Order Receipt */}
          <Col xs={12} lg={5}>
            <OrderReceipt
              selectedUsb={selectedUsb}
              selectedGames={selectedGames}
              totalGamesSize={totalGamesSize}
              locale={locale}
              langText={langText}
            />
          </Col>
        </Row>
      )}

      {/* ================= STEP 4: SUCCESS PLACED SCREEN ================= */}
      {activeStep === 4 && (
        <Card className="design-usb__card border-0 shadow-sm">
          <SuccessScreen
            locale={locale}
            langText={langText}
            user={user}
            onReset={handleResetWizard}
            onGoToProfile={() => {}}
          />
        </Card>
      )}

      {/* Game Details Modal */}
      <GameDetailsModal 
        show={showGameDetails} 
        onHide={() => {
          setShowGameDetails(false)
          setCurrentGame(null)
        }} 
        game={currentGame} 
        locale={locale} 
      />

      {/* Detailed USB status modal */}
      <UsbDetailsModal
        show={showUsbModal}
        onHide={() => setShowUsbModal(false)}
        usb={selectedUsb}
        selectedGames={selectedGames}
        locale={locale}
        onRemoveGame={handleRemoveGame}
        onCheckout={() => setActiveStep(3)}
      />
      
    </Container>
  )
}

export default DesignUsbStick