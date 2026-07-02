import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faShoppingCart, faTrashCan, faLayerGroup, faDesktop, faTimes, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import PackageCard from '../components/PackageCard/PackageCard.jsx'
import PackageDetailsModal from '../components/PackageDetailsModal/PackageDetailsModal.jsx'
import Pagination from '../components/admins/Pagination'
import Cart from '../components/Cart/Cart.jsx'
import CustomDropdown from '../components/CustomDropdown/CustomDropdown.jsx'
import './PackagesPage.css'

function PackagesPage({ locale, t, user, onShowAuth }) {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [packageTypes, setPackageTypes] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [platformId, setPlatformId] = useState('')
  const [packageTypeId, setPackageTypeId] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(12)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('package_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('package_cart', JSON.stringify(cart))
    // Notify other UI parts (e.g., mobile nav) after cart state is committed.
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }, [cart])

  useEffect(() => {
    async function loadFilters() {
      try {
        const [platRes, typeRes] = await Promise.all([
          fetch('/api/platforms'),
          fetch('/api/package-category-types'),
        ])

        if (platRes.ok) {
          const data = await platRes.json()
          setPlatforms(data.data ?? data)
        }

        if (typeRes.ok) {
          const data = await typeRes.json()
          setPackageTypes(data.data ?? data)
        }
      } catch (err) {
        console.error('Error loading filters:', err)
      }
    }

    loadFilters()
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function loadPackages() {
      try {
        const query = new URLSearchParams()
        query.set('per_page', perPage)
        query.set('page', page)
        if (search) query.set('search', search)
        if (platformId) query.set('platform_id', platformId)
        if (packageTypeId) query.set('package_category_type_id', packageTypeId)

        const response = await fetch(`/api/packages?${query.toString()}`)
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل الحزم.' : 'Unable to load packages.')
        }

        const data = await response.json()
        setPackages(data.data ?? data)
        setMeta(data.meta ?? {
          current_page: data.current_page ?? 1,
          last_page: data.last_page ?? 1,
          per_page: data.per_page ?? perPage,
          total: data.total ?? (data.data ? data.data.length : 0),
        })
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الحزم.' : 'Something went wrong while loading packages.'))
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [locale, search, platformId, packageTypeId, page, perPage])

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

  const handleClearAll = () => {
    setSearchInput('')
    setSearch('')
    setPlatformId('')
    setPackageTypeId('')
    setPage(1)
  }

  const handlePlatformChange = (event) => {
    setPlatformId(event.target.value)
    setPage(1)
  }

  const handlePackageTypeChange = (event) => {
    setPackageTypeId(event.target.value)
    setPage(1)
  }

  const platformOptions = useMemo(() =>
    platforms.map(p => ({ value: String(p.id), label: locale === 'ar' ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar) })),
    [platforms, locale]
  )

  const packageTypeOptions = useMemo(() =>
    packageTypes.map(t => ({ value: String(t.id), label: locale === 'ar' ? (t.name_ar || t.name_en) : (t.name_en || t.name_ar) })),
    [packageTypes, locale]
  )

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedPackage(null)
  }

  const handleAddToCart = (pkg) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pkg.id)
      if (existing) {
        return prev.map(item =>
          item.id === pkg.id
            ? { ...item, quantity: Math.min((item.quantity || 1) + 1, 10) }
            : item
        )
      }
      return [...prev, { ...pkg, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (pkgId) => {
    setCart(prev => {
      return prev.filter(item => item.id !== pkgId)
    })
  }

  const handleUpdateQuantity = (pkgId, delta) => {
    setCart(prev => {
      return prev.map(item =>
        item.id === pkgId
          ? { ...item, quantity: Math.max(1, Math.min(10, (item.quantity || 1) + delta)) }
          : item
      )
    })
  }

  const handleCheckout = () => {
    if (!user) {
      onShowAuth()
      return
    }
    navigate('/packages/checkout')
  }

  return (
    <Container className="packages-page py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">
          {locale === 'ar' ? 'اطلب الحزم الجاهزة' : 'Order Ready-Made Packages'}
        </h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          {locale === 'ar'
            ? 'تصفح الحزم الجاهزة من الألعاب والبرامج واطلبها مباشرة.'
            : 'Browse ready-made game and program packages and order them directly.'}
        </p>
      </div>

      <Row className="g-4">
        <Col xs={12} lg={8}>
          <Card className="shadow-sm border-0 mb-4 filters-card">
            <Card.Body className="py-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faSlidersH} className="text-muted" />
                  <span className="fw-semibold filters-title">
                    {locale === 'ar' ? 'تصفية الحزم' : 'Filter Packages'}
                  </span>
                </div>
                <Button variant="outline-danger" size="sm" onClick={handleClearAll} className="btn-clear-all">
                  <FontAwesomeIcon icon={faTrashCan} className="me-1" />
                  {locale === 'ar' ? 'مسح الكل' : 'Clear All'}
                </Button>
              </div>

              <Row className="g-3">
                <Col md={4}>
                  <div className="search-wrapper">
                    <div className="search-input-group">
                      <FontAwesomeIcon icon={faSearch} className="search-icon" />
                      <input
                        type="text"
                        className="search-field"
                        placeholder={locale === 'ar' ? 'ابحث باسم الحزمة...' : 'Search by package name...'}
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                      />
                      {searchInput && (
                        <button className="search-clear" onClick={() => setSearchInput('')} type="button">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      <button className="search-btn" onClick={handleSearchSubmit} type="button">
                        {locale === 'ar' ? 'بحث' : 'Search'}
                      </button>
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <CustomDropdown
                    options={[{ value: '', label: locale === 'ar' ? 'كل الأنواع' : 'All Types' }, ...packageTypeOptions]}
                    value={packageTypeId}
                    onChange={handlePackageTypeChange}
                    placeholder={locale === 'ar' ? 'اختر النوع...' : 'Select type...'}
                    locale={locale}
                    icon={faLayerGroup}
                  />
                </Col>

                <Col md={4}>
                  <CustomDropdown
                    options={[{ value: '', label: locale === 'ar' ? 'كل المنصات' : 'All Platforms' }, ...platformOptions]}
                    value={platformId}
                    onChange={handlePlatformChange}
                    placeholder={locale === 'ar' ? 'اختر المنصة...' : 'Select platform...'}
                    locale={locale}
                    icon={faDesktop}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" className="me-2" />
              <span>{locale === 'ar' ? 'جارٍ تحميل الحزم...' : 'Loading packages...'}</span>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <>
              {packages.length === 0 ? (
                <Alert variant="info">
                  {locale === 'ar' ? 'لا توجد حزم متاحة حالياً.' : 'No packages available at the moment.'}
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={2} xl={3} className="g-4">
                  {packages.map((pkg) => (
                    <Col key={pkg.id}>
                      <PackageCard 
                        pkg={pkg} 
                        locale={locale} 
                        t={t} 
                        onView={handleViewPackage}
                        onAddToCart={handleAddToCart}
                        isInCart={cart.some(item => item.id === pkg.id)}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              <Pagination
                currentPage={meta.current_page ?? page}
                lastPage={meta.last_page ?? 1}
                total={meta.total ?? 0}
                perPage={meta.per_page ?? perPage}
                onPageChange={(p) => setPage(p)}
                onPerPageChange={(n) => { setPerPage(n); setPage(1) }}
              />
            </>
          )}
        </Col>

        <Col xs={12} lg={4}>
          <div className="position-sticky d-none d-lg-block" style={{ top: '1rem' }}>
            <Cart
              items={cart}
              locale={locale}
              onCheckout={handleCheckout}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </Col>
      </Row>

      <PackageDetailsModal
        pkg={selectedPackage}
        show={showDetailsModal}
        onClose={handleCloseModal}
        onOrder={handleAddToCart}
        locale={locale}
        t={t}
      />

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            {locale === 'ar' ? 'السلة' : 'Cart'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Cart
            items={cart}
            locale={locale}
            onCheckout={() => { setShowCartModal(false); handleCheckout() }}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default PackagesPage
