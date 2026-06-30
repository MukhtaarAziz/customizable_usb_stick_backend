import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, InputGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faShoppingCart, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import PackageCard from '../components/PackageCard/PackageCard.jsx'
import PackageDetailsModal from '../components/PackageDetailsModal/PackageDetailsModal.jsx'
import Pagination from '../components/admins/Pagination'
import Cart from '../components/Cart/Cart.jsx'
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
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom">
              <span className="fw-semibold">{locale === 'ar' ? 'تصفية' : 'Filters'}</span>
              <Button variant="outline-danger" size="sm" onClick={handleClearAll}>
                <FontAwesomeIcon icon={faTrashCan} className="me-1" />
                {locale === 'ar' ? 'مسح' : 'Clear'}
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>{locale === 'ar' ? 'البحث' : 'Search'}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder={locale === 'ar' ? 'ابحث باسم الحزمة...' : 'Search by package name...'}
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                      />
                      <Button variant="outline-secondary" onClick={handleSearchSubmit}>
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                      {search && (
                        <Button variant="outline-danger" onClick={handleSearchClear}>
                          {locale === 'ar' ? 'مسح' : 'Clear'}
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>{locale === 'ar' ? 'نوع الحزمة' : 'Package Type'}</Form.Label>
                    <Form.Select value={packageTypeId} onChange={handlePackageTypeChange}>
                      <option value="">{locale === 'ar' ? 'الكل' : 'All'}</option>
                      {packageTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {locale === 'ar' ? type.name_ar || type.name_en : type.name_en || type.name_ar}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>{locale === 'ar' ? 'المنصة' : 'Platform'}</Form.Label>
                    <Form.Select value={platformId} onChange={handlePlatformChange}>
                      <option value="">{locale === 'ar' ? 'كل المنصات' : 'All platforms'}</option>
                      {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {locale === 'ar' ? platform.name_ar || platform.name_en : platform.name_en || platform.name_ar}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
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
