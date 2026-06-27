import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowRight, 
  faArrowLeft,
  faExclamationTriangle,
  faUserLock,
  faArrowRightToBracket
} from '@fortawesome/free-solid-svg-icons'
import DesignStepper from '../components/DesignStepper/DesignStepper.jsx'
import UsbSelectionGrid from '../components/UsbSelectionGrid/UsbSelectionGrid.jsx'
import GamesCatalog from '../components/GamesCatalog/GamesCatalog.jsx'
import CheckoutForm from '../components/CheckoutForm/CheckoutForm.jsx'
import OrderReceipt from '../components/OrderReceipt/OrderReceipt.jsx'
import SuccessScreen from '../components/SuccessScreen/SuccessScreen.jsx'
import GameDetailsModal from '../components/GameDetailsModal/GameDetailsModal.jsx'
import { CATALOG_TYPES } from '../config'
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
    chooseGamesTitle: 'Step 2: Choose Items & Fill USB',
    chooseGamesDesc: 'Browse the catalog and add games or programs to fill your selected capacity.',
    checkoutTitle: 'Step 3: Complete your Order Info',
    checkoutDesc: 'Provide your shipping address and contact details to receive your customized USB.',
    successTitle: 'Order Placed Successfully!',
    successDesc: 'We have received your customization order. Our team will start preparing your USB stick shortly.',
    estTimeLabel: 'Estimated Copy Time',
    basePrice: 'USB Base Price',
    totalSize: 'Total Items Size',
    freeSpace: 'Available Free Space',
    exceedWarn: 'Storage limit exceeded! Please remove some items.',
    customerName: 'Full Name',
    customerPhone: 'Phone Number (Iraqi Format)',
    customerEmail: 'Email Address (Optional)',
    customerGov: 'Governorate',
    customerAddress: 'Full Shipping Address',
    customerPoint: 'Nearest Famous Landmark / Service Point',
    confirmOrder: 'Confirm and Submit Order',
    backToGames: 'Back to Items Selection',
    backToUsb: 'Back to USB Selection',
    nextSelectGames: 'Next: Select Items',
    nextCheckout: 'Next: Shipping Info',
    gamesList: 'Selected Items',
    noGamesSelected: 'No items added yet.',
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
    loginRequired: 'Login Required',
    loginPrompt: 'You need to log in or register to complete your order.',
    loginToContinue: 'Login / Register',
  },
  ar: {
    step1: 'اختر الفلاش',
    step2: 'اختر الألعاب',
    step3: 'بيانات الطلب',
    step4: 'تم بنجاح',
    selectUsbTitle: 'الخطوة 1: اختر فلاش ميموري USB المناسب لك',
    selectUsbDesc: 'حدد سعة التخزين ونوع المنفذ الذي يناسب احتياجاتك.',
    chooseGamesTitle: 'الخطوة 2: اختر العناصر واملأ الفلاش',
    chooseGamesDesc: 'تصفح قائمة الألعاب والبرامج المتاحة وأضفها لملء المساحة المتاحة.',
    checkoutTitle: 'الخطوة 3: استكمال معلومات التوصيل والطلب',
    checkoutDesc: 'أدخل تفاصيل العنوان ورقم الهاتف لاستلام طلبك المخصص.',
    successTitle: 'تم إرسال الطلب بنجاح!',
    successDesc: 'لقد استلمنا طلب تخصيص الفلاشة الخاص بك. سيبدأ فريق العمل بنسخ الألعاب وتجهيز الطلب قريباً.',
    estTimeLabel: 'وقت النسخ المقدر',
    basePrice: 'سعر الفلاش الأساسي',
    totalSize: 'إجمالي حجم العناصر',
    freeSpace: 'المساحة المتبقية بالفلاش',
    exceedWarn: 'لقد تجاوزت المساحة المتاحة بالفلاش! يرجى إزالة بعض العناصر.',
    customerName: 'الاسم الكامل',
    customerPhone: 'رقم الهاتف (عراقي)',
    customerEmail: 'البريد الإلكتروني (اختياري)',
    customerGov: 'المحافظة',
    customerAddress: 'العنوان بالتفصيل',
    customerPoint: 'أقرب نقطة دالة / نقطة خدمة',
    confirmOrder: 'تأكيد وإرسال الطلب',
    backToGames: 'العودة لاختيار العناصر',
    backToUsb: 'العودة لاختيار الفلاش',
    nextSelectGames: 'التالي: اختيار العناصر',
    nextCheckout: 'التالي: معلومات الشحن',
    gamesList: 'العناصر المضافة',
    noGamesSelected: 'لم يتم إضافة عناصر بعد.',
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
    loginRequired: 'تسجيل الدخول مطلوب',
    loginPrompt: 'يجب تسجيل الدخول أو إنشاء حساب لإتمام الطلب.',
    loginToContinue: 'تسجيل الدخول / التسجيل',
  }
}

function DesignUsbStick({
  locale,
  user,
  onShowAuth,
  selectedUsbId,
  setSelectedUsbId,
  selectedItems,
  setSelectedItems,
  showUsbModal,
  setShowUsbModal,
  activeStep,
  setActiveStep
}) {
  
  // Data State
  const [usbSticks, setUsbSticks] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [governorates, setGovernorates] = useState([])
  
  // Loading & Error States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Selection States
  const [viewMode, setViewMode] = useState('grid')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [catalogType, setCatalogType] = useState('all')
  const [platformId, setPlatformId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [perPage, setPerPage] = useState(12)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 })
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

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

  const totalItemsSize = selectedItems.reduce((acc, item) => acc + (Number(item.size_gb) || 0), 0)
  const isOverCapacity = selectedUsb && totalItemsSize > Number(selectedUsb.size_gb)
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

  // Load USBs, platforms, categories, governorates, program filter options on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [usbRes, platRes, catRes, govRes] = await Promise.all([
          fetch('/api/usb-sticks'),
          fetch('/api/game-platforms?show_all=true'),
          fetch('/api/categories?show_all=true'),
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
          const allCategories = (data.data ?? data).map(c => ({
            ...c,
            type: c.category_type_id === 1 ? 'game' : 'program'
          }))
          setCategories(allCategories)
        }

        if (govRes.ok) {
          const data = await govRes.json()
          setGovernorates(data.data ?? data)
        }
      } catch (err) {
        console.error('Error loading data:', err)
      }
    }

    loadMeta()
  }, [])

  // Load catalog items with search/filter parameters
  useEffect(() => {
    async function loadItems() {
      setLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams()
        query.set('per_page', perPage)
        query.set('page', page)
        if (search) query.set('search', search)
        if (catalogType && catalogType !== 'all') query.set('type', catalogType)
        if (platformId) query.set('platform_id', platformId)
        if (categoryId) query.set('category_id', categoryId)

        const response = await fetch(`/api/catalog?${query.toString()}`)
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل العناصر.' : 'Unable to load items.')
        }

        const data = await response.json()
        setItems(data.data ?? data)
        setMeta(data.meta ?? {
          current_page: data.current_page ?? 1,
          last_page: data.last_page ?? 1,
        })
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل العناصر.' : 'Something went wrong while loading items.'))
      } finally {
        setLoading(false)
      }
    }

    if (selectedUsbId) {
      loadItems()
    } else {
      setItems([])
      setMeta({ current_page: 1, last_page: 1 })
      setLoading(false)
    }
  }, [locale, search, catalogType, platformId, categoryId, page, perPage, selectedUsbId])

  const handleUsbChange = (usbId) => {
    setSelectedUsbId(usbId)
    setSelectedItems([])
    setPage(1)
  }

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
  }

  const handleSearchSubmit = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  const handleTypeChange = (event) => {
    setCatalogType(event.target.value)
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

  const handleAddItem = (item) => {
    setSelectedItems((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) return prev
      return [...prev, item]
    })
  }

  const handleRemoveItem = (itemId, itemType) => {
    setSelectedItems((prev) => prev.filter((i) => !(i.id === itemId && i.type === itemType)))
  }

  const handleViewItemDetails = (item) => {
    setCurrentItem(item)
    setShowItemDetails(true)
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
    if (selectedItems.length === 0) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار عنصر واحد على الأقل' : 'Please select at least one item')
      return
    }

    setIsSubmitting(true)

    try {
      if (!user || !user.token) {
        throw new Error(locale === 'ar' ? 'يجب تسجيل الدخول أولاً.' : 'You must be logged in first.')
      }

      // Create custom USB order
      const gameIds = selectedItems.filter(i => i.type === 'game').map(i => i.id)
      const programIds = selectedItems.filter(i => i.type === 'program').map(i => i.id)
      const orderData = {
        usb_stick_id: parseInt(selectedUsbId),
        game_ids: gameIds.length > 0 ? gameIds : undefined,
        program_ids: programIds.length > 0 ? programIds : undefined,
        notes: checkoutForm.notes || null,
        custom_message: checkoutForm.custom_message || null,
        delivery_address: checkoutForm.address,
        phone: checkoutForm.phone
      }

      const orderResponse = await fetch('/api/usb-stick-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
          const errorData = await orderResponse.json().catch(() => ({}))
          const errorMessage = errorData.message || errorData.error || (locale === 'ar' ? 'فشل إرسال الطلب.' : 'Failed to submit order.')
          throw new Error(errorMessage)
      }

      // Success - clear selections and show success screen
      setSelectedItems([])
      setSelectedUsbId('')
      setActiveStep(4)
    } catch (err) {
      setValidationError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetWizard = () => {
    setSelectedUsbId('')
    setSelectedItems([])
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
          <Card.Body className="p-4">
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
          </Card.Body>
        </Card>
      )}

      {/* ================= STEP 2: BROWSE AND SELECT ITEMS ================= */}
      {activeStep === 2 && (
        <Row className="gy-4">
          <Col xs={12}>
            <Card className="design-usb__card shadow-sm border-0 mb-4">
              <div className="mb-4">
                <h4 className="fw-bold mb-1">{langText.chooseGamesTitle}</h4>
                <p className="text-muted small">{langText.chooseGamesDesc}</p>
              </div>
            </Card>

            <GamesCatalog
              items={items}
              loading={loading}
              error={error}
              search={searchInput}
              catalogType={catalogType}
              platformId={platformId}
              categoryId={categoryId}
              perPage={perPage}
              page={page}
              meta={meta}
              platforms={platforms}
              categories={categories}
              viewMode={viewMode}
              selectedIds={selectedItems.map(i => `${i.type}-${i.id}`)}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onSearchClear={handleSearchClear}
              onTypeChange={handleTypeChange}
              onPlatformChange={handlePlatformChange}
              onCategoryChange={handleCategoryChange}
              onPerPageChange={handlePerPageChange}
              onPageChange={setPage}
              onViewModeChange={setViewMode}
              onViewItemDetails={handleViewItemDetails}
              onAddItem={handleAddItem}
              locale={locale}
            />


            {/* Floating Action Button for Desktop/Tablet - Now Positioned Absolutely */}
            <Button 
              variant="primary" 
              className="design-usb__floating-action d-none d-md-flex align-items-center justify-content-center rtl-float ms-n3 mb-4"
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
              {selectedItems.length > 0 && (
                <Badge bg="light" text="primary" pill className={locale === 'ar' ? 'me-2 fs-6' : 'ms-2 fs-6'}>
                  {selectedItems.length}
                </Badge>
              )}
            </Button>
          </Col>
        </Row>
      )}

      {/* ================= STEP 3: CUSTOMER SHIPPING INFO & INVOICE RECEIPT ================= */}
      {activeStep === 3 && (
        <Row className="gy-4">
          {/* Checkout Form or Login Prompt */}
          <Col xs={12} lg={7}>
            {user ? (
              <Card className="design-usb__card border-0 shadow-sm">
                <Card.Body className="p-4">
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
                </Card.Body>
              </Card>
            ) : (
              <Card className="design-usb__card border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <FontAwesomeIcon icon={faUserLock} className="text-muted mb-3" style={{ fontSize: '4rem' }} />
                  <h4 className="fw-bold mb-2">{langText.loginRequired}</h4>
                  <p className="text-muted mb-4">{langText.loginPrompt}</p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline-secondary" onClick={() => setActiveStep(2)}>
                      <FontAwesomeIcon icon={locale === 'ar' ? faArrowRight : faArrowLeft} className="me-2" />
                      {langText.backToGames}
                    </Button>
                    <Button variant="primary" size="lg" onClick={onShowAuth}>
                      <FontAwesomeIcon icon={faArrowRightToBracket} className="me-2" />
                      {langText.loginToContinue}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Receipt (always visible) */}
          <Col xs={12} lg={5}>
            <OrderReceipt
              selectedUsb={selectedUsb}
              selectedItems={selectedItems}
              totalItemsSize={totalItemsSize}
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

      {/* Persistent Navigation Buttons at Bottom */}
      {activeStep >= 1 && activeStep <= 3 && (
        <Card className="design-usb__card shadow-sm border-0 mt-4">
          <Card.Body className="p-4">
            <div className="wizard-nav-buttons">
              {activeStep > 1 && (
                <Button 
                  variant="outline-secondary" 
                  className="wizard-btn-back text-start rtl-float"
                  onClick={() => {
                    if (activeStep === 2) setActiveStep(1)
                    if (activeStep === 3) setActiveStep(2)
                  }}
                >
                  <FontAwesomeIcon icon={locale === 'ar' ? faArrowRight : faArrowLeft} />
                  <span className="wizard-btn-text">
                    {activeStep === 2 ? langText.backToUsb : langText.backToGames}
                  </span>
                </Button>
              )}

              {activeStep < 3 && (
                <Button 
                  variant="primary" 
                  className="wizard-btn-next text-end rtl-float"
                  disabled={activeStep === 1 ? !selectedUsbId : (selectedItems.length === 0 || isOverCapacity)}
                  onClick={() => {
                    if (activeStep === 1) setActiveStep(2)
                    if (activeStep === 2) setActiveStep(3)
                  }}
                >
                  <span className="wizard-btn-text">
                    {activeStep === 1 ? langText.nextSelectGames : langText.nextCheckout}
                  </span>
                  <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} />
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Item Details Modal */}
      <GameDetailsModal 
        show={showItemDetails} 
        onHide={() => {
          setShowItemDetails(false)
          setCurrentItem(null)
        }} 
        item={currentItem} 
        locale={locale} 
      />

      {/* Detailed USB status modal */}
      <UsbDetailsModal
        show={showUsbModal}
        onHide={() => setShowUsbModal(false)}
        usb={selectedUsb}
        selectedItems={selectedItems}
        locale={locale}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setActiveStep(3)}
      />
      
    </Container>
  )
}

export default DesignUsbStick