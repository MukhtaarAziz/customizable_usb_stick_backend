import { useEffect, useState, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import HeroSection from './components/HeroSection/HeroSection.jsx'
import PackageList from './components/PackageList/PackageList.jsx'
import LatestPackagesCarousel from './components/LatestPackagesCarousel/LatestPackagesCarousel.jsx'
import PackageDetailsModal from './components/PackageDetailsModal/PackageDetailsModal.jsx'
import ClientLayout from './components/ClientLayout/ClientLayout.jsx'
import PackagesPage from './pages/PackagesPage.jsx'
import PackagesCheckout from './pages/PackagesCheckout/PackagesCheckout.jsx'
import DesignUsbStick from './pages/DesignUsbStick.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AdminLayout from './components/admins/AdminLayout/AdminLayout.jsx'
import AdminDashboard from './pages/admins/Dashboard.jsx'
import AdminPackages from './pages/admins/Packages.jsx'
import AdminGames from './pages/admins/Games.jsx'
import AdminPrograms from './pages/admins/Programs.jsx'
import AdminPlatforms from './pages/admins/Platforms.jsx'
import AdminCategories from './pages/admins/Categories.jsx'
import AdminContentCategories from './pages/admins/ContentCategories.jsx'
import AdminCategoryTypes from './pages/admins/CategoryTypes.jsx'
import AdminPackageOrders from './pages/admins/Orders.jsx'
import AdminUsbStickOrders from './pages/admins/SubOrders.jsx'
import AdminUsers from './pages/admins/Users.jsx'
import AdminCustomers from './pages/admins/Customers.jsx'
import AdminSettings from './pages/admins/Settings.jsx'
import AdminStorageDeviceTypes from './pages/admins/StorageDeviceTypes.jsx'
import AdminStorageDevices from './pages/admins/StorageDevices.jsx'

const translations = {
  en: {
    brand: 'Customizable USB Stick',
    navPackages: 'Packages',
    navFeatures: 'Features',
    heroSmall: 'Customizable USB Stick',
    heroTitle: 'Discover ready-made game packages for your USB stick',
    navLoginProfile: 'Login / Profile',
    navDesignUSB: 'Design Your USB',
    navHome: 'Home',
    heroCopy: 'Browse curated packages, compare platforms, and choose the best bundle for your device. This landing page is built with React and Bootstrap.',
    browsePackages: 'Browse Packages',
    learnMore: 'Learn More',
    featuredTitle: 'Choose the right bundle for your USB stick',
    featuredSubtitle: 'Explore curated game packages, view platform support, and compare bundle details all in one place.',
    feature1Title: 'Ready-made bundles',
    feature1Text: 'Browse packages with preselected games and supported platforms to save time.',
    feature2Title: 'Fast browsing',
    feature2Text: 'Built with React and Bootstrap, this landing page is responsive and easy to extend.',
    feature3Title: 'Mobile friendly',
    feature3Text: 'The page works cleanly on devices of all sizes using Bootstrap grid styles.',
    loading: 'Loading packages...',
    noPackages: 'No packages available at the moment. Please try again later.',
    viewPackage: 'View package',
    views: 'views',
    orders: 'orders',
    toggleDark: 'Dark Mode',
    toggleLight: 'Light Mode',
    toggleEnglish: 'English',
    toggleArabic: 'العربية',
    general: 'General',
    packagesHeader: 'Featured packages',
  },
  ar: {
    brand: 'USB قابل للتخصيص',
    navPackages: 'الحزم',
    navFeatures: 'المزايا',
    heroSmall: 'USB قابل للتخصيص',
    heroTitle: 'اكتشف حزم الألعاب الجاهزة لـ USB الخاص بك',
    navLoginProfile: 'تسجيل الدخول / الملف',
    navDesignUSB: 'صمم USB',
    navHome: 'الرئيسية',
    heroCopy: 'استعرض الحزم المجمعة، قارن المنصات، واختر أفضل باقة لجهازك. تم بناء صفحة الهبوط باستخدام React و Bootstrap.',
    browsePackages: 'استعراض الحزم',
    learnMore: 'اعرف المزيد',
    featuredTitle: 'اختر الباقة المناسبة لـ USB',
    featuredSubtitle: 'استعرض حزم الألعاب المجمعة، واعرض دعم المنصات، وقارن تفاصيل الباقات في مكان واحد.',
    feature1Title: 'حزم جاهزة',
    feature1Text: 'استعرض الحزم التي تحتوي على ألعاب محددة مسبقاً ومنصات مدعومة لتوفير الوقت.',
    feature2Title: 'تصفح سريع',
    feature2Text: 'تم بناء هذه الصفحة بـ React و Bootstrap لتكون سريعة وسهلة التوسيع.',
    feature3Title: 'متوافق مع الموبايل',
    feature3Text: 'يعمل الموقع بشكل جيد على جميع الأجهزة باستخدام شبكة Bootstrap.',
    loading: 'جارٍ تحميل الحزم...',
    noPackages: 'لا توجد حزم متاحة حالياً. حاول مرة أخرى لاحقاً.',
    viewPackage: 'عرض الباقة',
    views: 'مشاهدات',
    orders: 'طلبات',
    toggleDark: 'الوضع المظلم',
    toggleLight: 'الوضع الفاتح',
    toggleEnglish: 'English',
    toggleArabic: 'العربية',
    general: 'عام',
    packagesHeader: 'الحزم المميزة',
  },
}

function App() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [locale, setLocale] = useState('en')
  const [theme, setTheme] = useState('light')

  // Lifted Customizer selection states
  const [selectedUsbId, setSelectedUsbId] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [showUsbModal, setShowUsbModal] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const packagesRef = useRef(null)
  const t = translations[locale]

  useEffect(() => {
    async function loadPackages() {
      try {
        const response = await fetch('/api/game-packages')
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل الحزم من الخادم.' : 'Unable to load packages from server.')
        }

        const data = await response.json()
        setPackages(data.data ?? data)
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الحزم.' : 'Something went wrong while loading packages.'))
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [locale])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  // Load auth and site settings from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken')
      const userJson = localStorage.getItem('user')
      const settingsJson = localStorage.getItem('siteSettings')

      if (userJson) {
        setUser(JSON.parse(userJson))
      }

      if (settingsJson) {
        const settings = JSON.parse(settingsJson)
        if (settings.locale) setLocale(settings.locale)
        if (settings.theme) setTheme(settings.theme)
      }

      // keep token in storage; optional: set default auth header globally if needed
      if (token) {
        // future: attach token to global fetch or axios
      }
    } catch (err) {
      console.error('Failed to restore auth from storage', err)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    document.body.classList.toggle('theme-light', theme === 'light')
  }, [theme])

  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLocale = () => {
    setLocale((prevLocale) => (prevLocale === 'en' ? 'ar' : 'en'))
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const confirmLeaveDesign = (path) => {
    if (path === '/design') {
      navigate(path)
      return
    }

    if (
      location.pathname === '/design' &&
      activeStep !== 4 &&
      (selectedUsbId || selectedItems.length > 0)
    ) {
      const msg = locale === 'ar'
        ? 'لديك إعدادات USB نشطة. مغادرة هذه الصفحة ستؤدي إلى مسح اختياراتك. هل أنت متأكد من المغادرة؟'
        : 'You have an active USB configuration. Leaving this page will clear your selection. Are you sure you want to leave?'

      if (!window.confirm(msg)) {
        return
      }
      // If confirmed, reset configuration
      setSelectedUsbId('')
      setSelectedItems([])
      setActiveStep(1)
    }
    navigate(path)
  }

  const goHome = () => confirmLeaveDesign('/')
  const goPackages = () => confirmLeaveDesign('/packages')
  const handleDesignUsb = () => confirmLeaveDesign('/design')
  const handleSupport = () => confirmLeaveDesign('/support')

  const HomePage = () => {
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const handleViewPackage = (pkg) => {
      setSelectedPackage(pkg)
      setShowDetailsModal(true)
    }

    const handleCloseModal = () => {
      setShowDetailsModal(false)
      setSelectedPackage(null)
    }

    return (
      <>
        <HeroSection onBrowse={scrollToPackages} t={t} />

        <LatestPackagesCarousel locale={locale} t={t} onViewPackage={handleViewPackage} />

        <Container className="py-5" ref={packagesRef} id="packages-section">
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary mb-2">{t.packagesHeader}</p>
            <h2 className="fw-bold">{t.featuredTitle}</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '680px' }}>
              {t.featuredSubtitle}
            </p>
          </div>

        </Container>

        <section className="bg-light py-5" id="features-section">
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <div className="feature-card p-4 h-100 shadow-sm rounded-4">
                  <h5 className="fw-bold">{t.feature1Title}</h5>
                  <p className="text-muted">{t.feature1Text}</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card p-4 h-100 shadow-sm rounded-4">
                  <h5 className="fw-bold">{t.feature2Title}</h5>
                  <p className="text-muted">{t.feature2Text}</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-card p-4 h-100 shadow-sm rounded-4">
                  <h5 className="fw-bold">{t.feature3Title}</h5>
                  <p className="text-muted">{t.feature3Text}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <PackageDetailsModal
          pkg={selectedPackage}
          show={showDetailsModal}
          onClose={handleCloseModal}
          onOrder={handleCloseModal}
          locale={locale}
          t={t}
        />
      </>
    )
  }

  const handleAuth = (u) => {
    // u may be either a raw user object or an object { user, token, settings }
    if (!u) return
    if (u.user) {
      // Add token to user object for easy access
      const userWithToken = { ...u.user, token: u.token }
      setUser(userWithToken)
      if (u.token) localStorage.setItem('authToken', u.token)
      localStorage.setItem('user', JSON.stringify(userWithToken))
      if (u.settings) {
        localStorage.setItem('siteSettings', JSON.stringify(u.settings))
        if (u.settings.locale) setLocale(u.settings.locale)
        if (u.settings.theme) setTheme(u.settings.theme)
      }
    } else {
      setUser(u)
      try {
        localStorage.setItem('user', JSON.stringify(u))
      } catch (e) {}
    }

    setShowAuth(false)

    if (u.user?.role === 'admin') {
      navigate('/admin')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('package_cart')
  }

  const handleProfileClick = () => {
    console.log('Profile clicked, user:', user)
    if (user) {
      confirmLeaveDesign('/profile')
    } else {
      setShowAuth(true)
    }
  }

  const handleCloseAuth = () => setShowAuth(false)

  return (
    <Routes>
      <Route
        element={
          <ClientLayout
            t={t}
            theme={theme}
            locale={locale}
            user={user}
            onToggleTheme={toggleTheme}
            onToggleLocale={toggleLocale}
            onLogout={handleLogout}
            onNavigate={confirmLeaveDesign}
            showAuth={showAuth}
            onShowAuth={() => setShowAuth(true)}
            onCloseAuth={handleCloseAuth}
            onAuth={handleAuth}
            activeStep={activeStep}
            selectedUsbId={selectedUsbId}
            setShowUsbModal={setShowUsbModal}
            handleProfileClick={handleProfileClick}
          />
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/packages" element={<PackagesPage locale={locale} t={t} user={user} onShowAuth={() => setShowAuth(true)} />} />
        <Route path="/packages/checkout" element={<PackagesCheckout locale={locale} user={user} onShowAuth={() => setShowAuth(true)} />} />
        <Route
          path="/design"
          element={
            <DesignUsbStick
              locale={locale}
              t={t}
              user={user}
              onShowAuth={() => setShowAuth(true)}
              selectedUsbId={selectedUsbId}
              setSelectedUsbId={setSelectedUsbId}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              showUsbModal={showUsbModal}
              setShowUsbModal={setShowUsbModal}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} locale={locale} t={t} />} key={user?.token || 'no-token'} />
        <Route path="/support" element={<SupportPage locale={locale} t={t} />} />
        <Route path="*" element={<NotFoundPage locale={locale} t={t} onNavigate={confirmLeaveDesign} />} />
      </Route>
      <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="programs" element={<AdminPrograms />} />
        <Route path="platforms" element={<AdminPlatforms />} />
        <Route path="category-types" element={<AdminCategoryTypes />} />
        <Route path="content-categories" element={<AdminContentCategories />} />
        <Route path="package-categories" element={<AdminCategories />} />
        <Route path="orders" element={<Navigate to="orders/packages" replace />} />
        <Route path="orders/packages" element={<AdminPackageOrders />} />
        <Route path="orders/usb-sticks" element={<AdminUsbStickOrders />} />
        <Route path="sub-orders" element={<Navigate to="orders/usb-sticks" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="storage-device-types" element={<AdminStorageDeviceTypes />} />
        <Route path="storage-devices" element={<AdminStorageDevices />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App
