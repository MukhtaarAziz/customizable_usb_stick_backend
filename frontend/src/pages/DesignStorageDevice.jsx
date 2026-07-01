import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faArrowLeft,
  faUserLock,
  faArrowRightToBracket,
  faArrowRightFromBracket,
  faMemory,
  faCompactDisc,
  faHdd,
  faMicrochip,
  faSdCard,
  faDatabase,
  faFilter
} from '@fortawesome/free-solid-svg-icons'
import DesignStepper from '../components/DesignStepper/DesignStepper.jsx'
import StorageSelectionGrid from '../components/StorageSelectionGrid/StorageSelectionGrid.jsx'
import GamesCatalog from '../components/GamesCatalog/GamesCatalog.jsx'
import CheckoutForm from '../components/CheckoutForm/CheckoutForm.jsx'
import OrderReceipt from '../components/OrderReceipt/OrderReceipt.jsx'
import SuccessScreen from '../components/SuccessScreen/SuccessScreen.jsx'
import GameDetailsModal from '../components/GameDetailsModal/GameDetailsModal.jsx'
import StorageDetailsModal from '../components/StorageDetailsModal/StorageDetailsModal.jsx'
import './DesignStorageDevice.css'

const stepsText = {
  en: {
    step1: 'Select Storage',
    step2: 'Choose Items',
    step3: 'Checkout Info',
    step4: 'Done',
    selectUsbTitle: 'Step 1: Choose your Storage Device',
    selectUsbDesc: 'Select the storage size and interface type that suits your needs.',
    chooseGamesTitle: 'Step 2: Choose Items & Fill Storage',
    chooseGamesDesc: 'Browse the catalog and add games or programs to fill your selected capacity.',
    checkoutTitle: 'Step 3: Complete your Order Info',
    checkoutDesc: 'Provide your shipping address and contact details to receive your customized storage device.',
    successTitle: 'Order Placed Successfully!',
    successDesc: 'We have received your customization order. Our team will start preparing your storage device shortly.',
    estTimeLabel: 'Estimated Copy Time',
    basePrice: 'Storage Base Price',
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
    backToUsb: 'Back to Storage Selection',
    nextSelectGames: 'Next: Select Items',
    nextCheckout: 'Next: Shipping Info',
    gamesList: 'Selected Items',
    noGamesSelected: 'No items added yet.',
    emptyStick: 'Please select a storage device from Step 1 to begin.',
    stickLabel: 'Selected Storage Device',
    govPlaceholder: '-- Select your Governorate --',
    submitLoading: 'Submitting your order...',
    invalidPhone: 'Please enter a valid Iraqi phone number (e.g. 07701234567, 07801234567, 07501234567).',
    designNew: 'Customize Another Device',
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
    step1: 'اختر جهاز التخزين',
    step2: 'اختر العناصر',
    step3: 'بيانات الطلب',
    step4: 'تم بنجاح',
    selectUsbTitle: 'الخطوة 1: اختر جهاز التخزين المناسب لك',
    selectUsbDesc: 'حدد سعة التخزين ونوع المنفذ الذي يناسب احتياجاتك.',
    chooseGamesTitle: 'الخطوة 2: اختر العناصر واملأ جهاز التخزين',
    chooseGamesDesc: 'تصفح قائمة الألعاب والبرامج المتاحة وأضفها لملء المساحة المتاحة.',
    checkoutTitle: 'الخطوة 3: استكمال معلومات التوصيل والطلب',
    checkoutDesc: 'أدخل تفاصيل العنوان ورقم الهاتف لاستلام طلبك المخصص.',
    successTitle: 'تم إرسال الطلب بنجاح!',
    successDesc: 'لقد استلمنا طلب تخصيص جهاز التخزين الخاص بك. سيبدأ فريق العمل بنسخ البيانات وتجهيز الطلب قريباً.',
    estTimeLabel: 'وقت النسخ المقدر',
    basePrice: 'سعر جهاز التخزين الأساسي',
    totalSize: 'إجمالي حجم العناصر',
    freeSpace: 'المساحة المتبقية',
    exceedWarn: 'لقد تجاوزت المساحة المتاحة! يرجى إزالة بعض العناصر.',
    customerName: 'الاسم الكامل',
    customerPhone: 'رقم الهاتف (عراقي)',
    customerEmail: 'البريد الإلكتروني (اختياري)',
    customerGov: 'المحافظة',
    customerAddress: 'العنوان بالتفصيل',
    customerPoint: 'أقرب نقطة دالة / نقطة خدمة',
    confirmOrder: 'تأكيد وإرسال الطلب',
    backToGames: 'العودة لاختيار العناصر',
    backToUsb: 'العودة لاختيار جهاز التخزين',
    nextSelectGames: 'التالي: اختيار العناصر',
    nextCheckout: 'التالي: معلومات الشحن',
    gamesList: 'العناصر المضافة',
    noGamesSelected: 'لم يتم إضافة عناصر بعد.',
    emptyStick: 'يرجى تحديد جهاز تخزين من الخطوة الأولى للبدء.',
    stickLabel: 'جهاز التخزين المحدد',
    govPlaceholder: '-- اختر المحافظة --',
    submitLoading: 'جاري إرسال طلبك...',
    invalidPhone: 'يرجى إدخال رقم هاتف عراقي صحيح (مثل 07701234567 أو 07801234567 أو 07501234567).',
    designNew: 'تخصيص جهاز آخر',
    goProfile: 'الذهاب إلى الملف الشخصي',
    addressPlaceholder: 'مثال: بغداد، المنصور، شارع 14 رمضان، قرب تقاطع الرواد',
    pointPlaceholder: 'مثال: قرب مول المنصور أو مركز كورك الرئيسي',
    receiptTitle: 'ملخص الفاتورة',
    capacityUsed: 'السعة المستخدمة',
    loginRequired: 'تسجيل الدخول مطلوب',
    loginPrompt: 'يجب تسجيل الدخول أو إنشاء حساب لإتمام الطلب.',
    loginToContinue: 'تسجيل الدخول / التسجيل',
  }
}

function DesignStorageDevice({
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
  const [devices, setDevices] = useState([])
  const [deviceLoading, setDeviceLoading] = useState(true)
  const [deviceError, setDeviceError] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [governorates, setGovernorates] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  const [typeFilter, setTypeFilter] = useState('all')

  const navigate = useNavigate()

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    governorate_id: '',
    address: '',
    nearest_service_point: '',
    quantity: 1,
    password: 'password123'
  })
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedDevice = devices.find((d) => String(d.id) === String(selectedUsbId))

  const totalItemsSize = selectedItems.reduce((acc, item) => acc + (Number(item.size_gb) || 0), 0)
  const selectedDeviceGb = selectedDevice ? (Number(selectedDevice.size_mb) / 1024) : 0
  const isOverCapacity = selectedDevice && totalItemsSize > selectedDeviceGb
  const langText = stepsText[locale]

  const filteredDevices = useMemo(() => {
    if (typeFilter === 'all') return devices
    return devices.filter(d => {
      const name = d.storage_type?.name_en?.toLowerCase() || ''
      switch (typeFilter) {
        case 'cd': return name.includes('cd') || name.includes('dvd') || name.includes('rom')
        case 'usb': return name.includes('usb') || name.includes('flash') || name.includes('stick')
        case 'hdd': return name.includes('hdd') || name.includes('hard')
        case 'ssd': return name.includes('ssd') || name.includes('solid')
        case 'm2': return name.includes('m.2') || name.includes('nvme')
        default: return true
      }
    })
  }, [devices, typeFilter])

  useEffect(() => {
    if (user) {
      setCheckoutForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        governorate_id: user.governorate_id || '',
        address: user.address || '',
        nearest_service_point: user.nearest_service_point || '',
      }))
    }
  }, [user])

  useEffect(() => {
    async function loadMeta() {
      setDeviceLoading(true)
      setDeviceError(null)
      try {
        const [deviceRes, platRes, catRes, govRes] = await Promise.all([
          fetch('/api/storage-devices?per_page=100'),
          fetch('/api/game-platforms?show_all=true'),
          fetch('/api/categories?show_all=true'),
          fetch('/api/governorates')
        ])

        if (deviceRes.ok) {
          const data = await deviceRes.json()
          const allDevices = data.data ?? data
          setDevices(allDevices.filter(d => d.customizable === false || d.customizable == null))
        } else {
          setDeviceError('Failed to load storage devices.')
        }

        if (platRes.ok) {
          const data = await platRes.json()
          setPlatforms(data.data ?? data)
        }

        if (catRes.ok) {
          const data = await catRes.json()
          setCategories((data.data ?? data).map(c => ({
            ...c,
            type: c.category_type_id === 1 ? 'game' : 'program'
          })))
        }

        if (govRes.ok) {
          const data = await govRes.json()
          setGovernorates(data.data ?? data)
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setDeviceError('An error occurred while loading data.')
      } finally {
        setDeviceLoading(false)
      }
    }

    loadMeta()
  }, [])

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

  const handleDeviceChange = (deviceId) => {
    setSelectedUsbId(deviceId)
    setSelectedItems([])
    setPage(1)
  }

  const handleSearchChange = (event) => setSearchInput(event.target.value)

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
    const { name, value, type: inputType, checked } = e.target
    setCheckoutForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
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
      setValidationError(locale === 'ar' ? 'يرجى اختيار جهاز تخزين' : 'Please select a storage device')
      return
    }
    if (selectedItems.length === 0) {
      setValidationError(locale === 'ar' ? 'يرجى اختيار عنصر واحد على الأقل' : 'Please select at least one item')
      return
    }

    setIsSubmitting(true)

    try {
      const authToken = user?.token || localStorage.getItem('authToken')
      if (!authToken) {
        throw new Error(locale === 'ar' ? 'يجب تسجيل الدخول أولاً.' : 'You must be logged in first.')
      }

      const gameIds = selectedItems.filter(i => i.type === 'game').map(i => i.id)
      const programIds = selectedItems.filter(i => i.type === 'program').map(i => i.id)
      const orderData = {
        storage_device_id: parseInt(selectedUsbId),
        quantity: parseInt(checkoutForm.quantity) || 1,
        game_ids: gameIds.length > 0 ? gameIds : undefined,
        program_ids: programIds.length > 0 ? programIds : undefined,
        notes: checkoutForm.notes || null,
        custom_message: checkoutForm.custom_message || null,
        delivery_address: checkoutForm.address,
        phone: checkoutForm.phone
      }

      const orderResponse = await fetch('/api/storage-device-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}))
        const errorMessage = errorData.message || errorData.error || (locale === 'ar' ? 'فشل إرسال الطلب.' : 'Failed to submit order.')
        throw new Error(errorMessage)
      }

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

  const headerTitle = locale === 'ar' ? 'خصص جهاز التخزين الخاص بك' : 'Customize Your Storage Device'
  const headerDesc = locale === 'ar'
    ? 'قم ببناء جهاز تخزين مخصص بألعابك وبرامجك المفضلة بخطوات بسيطة ومرنة.'
    : 'Build a customized storage device with your favorite games and programs in simple and flexible steps.'

  return (
    <Container className="design-storage">
      <div className="design-storage__header">
        <h1 className="design-storage__header-title">{headerTitle}</h1>
        <p className="design-storage__header-desc">{headerDesc}</p>
        <span className="design-storage__header-accent" />
      </div>

      <DesignStepper activeStep={activeStep} locale={locale} langText={langText} />

      {deviceLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="text-muted mt-2">{locale === 'ar' ? 'جاري تحميل أجهزة التخزين...' : 'Loading storage devices...'}</p>
        </div>
      )}

      {deviceError && !deviceLoading && (
        <Alert variant="danger" className="my-4">{deviceError}</Alert>
      )}

      {!deviceLoading && !deviceError && activeStep === 1 && (
        <Card className="design-storage__card shadow-sm border-0">
          <Card.Body className="p-4">
            <div className="ds-filter-bar">
              <span className="ds-filter-bar__label">
                <FontAwesomeIcon icon={faFilter} className="ds-filter-bar__label-icon" />
                {locale === 'ar' ? 'تصفية حسب النوع' : 'Filter by type'}
              </span>
              <div className="ds-filter-bar__options">
                {[
                  { key: 'all', label: locale === 'ar' ? 'الكل' : 'All', icon: faDatabase },
                  { key: 'cd', label: 'CD/DVD', icon: faCompactDisc },
                  { key: 'usb', label: 'USB', icon: faMemory },
                  { key: 'hdd', label: 'HDD', icon: faHdd },
                  { key: 'ssd', label: 'SSD', icon: faMicrochip },
                  { key: 'm2', label: 'M.2', icon: faSdCard },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`ds-filter-btn ${typeFilter === f.key ? 'active' : ''}`}
                    onClick={() => setTypeFilter(f.key)}
                  >
                    <FontAwesomeIcon icon={f.icon} className="ds-filter-btn__icon" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {filteredDevices.length === 0 ? (
              <div className="text-center py-4 text-muted">
                {locale === 'ar' ? 'لا توجد أجهزة تخزين متاحة حالياً.' : 'No storage devices available at the moment.'}
              </div>
            ) : (
              <StorageSelectionGrid
                devices={filteredDevices}
                selectedDeviceId={selectedUsbId}
                onSelect={handleDeviceChange}
                locale={locale}
              />
            )}
          </Card.Body>
        </Card>
      )}

      {activeStep === 2 && (
        <Row className="gy-4">
          <Col xs={12}>
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


          </Col>
        </Row>
      )}

      {activeStep === 3 && (
        <Row className="gy-4">
          <Col xs={12} lg={7}>
            {user ? (
              <Card className="design-storage__card border-0 shadow-sm">
                <Card.Body className="p-4">
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
              <Card className="design-storage__card border-0 shadow-sm">
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

          <Col xs={12} lg={5}>
            <OrderReceipt
              selectedUsb={selectedDevice}
              selectedItems={selectedItems}
              totalItemsSize={totalItemsSize}
              locale={locale}
              langText={langText}
            />
          </Col>
        </Row>
      )}

      {activeStep === 4 && (
        <Card className="design-storage__card border-0 shadow-sm">
          <SuccessScreen
            locale={locale}
            langText={langText}
            user={user}
            onReset={handleResetWizard}
            onGoToProfile={() => {}}
          />
        </Card>
      )}

      {activeStep >= 1 && activeStep <= 3 && (
        <nav className="ds-step-nav">
          <div className="ds-step-nav__inner">
            {activeStep > 1 ? (
              <button className="ds-step-btn ds-step-btn--back" onClick={() => {
                if (activeStep === 2) setActiveStep(1)
                if (activeStep === 3) setActiveStep(2)
              }}>
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowRight : faArrowLeft} />
                <span className="ds-step-btn__label">{locale === 'ar' ? 'رجوع' : 'Back'}</span>
              </button>
            ) : (
              <button className="ds-step-btn ds-step-btn--exit" onClick={() => navigate('/')}>
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowRight : faArrowRightFromBracket} />
                <span className="ds-step-btn__label">{locale === 'ar' ? 'خروج' : 'Exit'}</span>
              </button>
            )}

            <div className="ds-step-dots">
              <span className="ds-step-dots__label">{langText[`step${activeStep}`]}</span>
              <div className="ds-step-dots__track">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`ds-step-dot ${activeStep >= s ? 'filled' : ''} ${activeStep === s ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {activeStep < 3 ? (
              <button
                className="ds-step-btn ds-step-btn--next"
                disabled={activeStep === 1 ? !selectedUsbId : (selectedItems.length === 0 || isOverCapacity)}
                onClick={() => {
                  if (activeStep === 1) setActiveStep(2)
                  if (activeStep === 2) setActiveStep(3)
                }}
              >
                <span className="ds-step-btn__label">{locale === 'ar' ? 'التالي' : 'Next'}</span>
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} />
              </button>
            ) : (
              <div className="ds-step-btn ds-step-btn--spacer" />
            )}
          </div>
        </nav>
      )}

      <GameDetailsModal
        show={showItemDetails}
        onHide={() => { setShowItemDetails(false); setCurrentItem(null) }}
        item={currentItem}
        locale={locale}
      />

      <StorageDetailsModal
        show={showUsbModal}
        onHide={() => setShowUsbModal(false)}
        device={selectedDevice}
        selectedItems={selectedItems}
        locale={locale}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setActiveStep(3)}
      />

      {selectedUsbId && (
        <button
          className="ds-details-fab"
          onClick={() => setShowUsbModal(true)}
          aria-label={locale === 'ar' ? 'تفاصيل جهاز التخزين' : 'Storage Details'}
        >
          <FontAwesomeIcon icon={faMemory} className="ds-details-fab__icon" />
          <span className="ds-details-fab__label">
            {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          </span>
        </button>
      )}
    </Container>
  )
}

export default DesignStorageDevice
