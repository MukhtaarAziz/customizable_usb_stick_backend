import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Row, Col, Form, InputGroup, Button, Spinner, Alert, Pagination } from 'react-bootstrap'
import PackageList from '../components/PackageList/PackageList.jsx'
import PackageDetailsModal from '../components/PackageDetailsModal/PackageDetailsModal.jsx'

function PackagesPage({ locale, t }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [meta, setMeta] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const search = searchParams.get('search') || ''
  const platformId = searchParams.get('platform_id') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const perPage = 2

  useEffect(() => {
    async function loadPlatforms() {
      try {
        const response = await fetch('/api/platforms')
        if (!response.ok) throw new Error('Failed to load platforms.')
        const data = await response.json()
        setPlatforms(data.data ?? data)
      } catch (err) {
        console.warn(err)
      }
    }

    loadPlatforms()
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
  }, [locale, search, platformId, page])

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    const params = Object.fromEntries(searchParams.entries())
    if (newSearch) {
      params.search = newSearch
    } else {
      delete params.search
    }
    params.page = '1'
    setSearchParams(params)
  }

  const handlePlatformChange = (event) => {
    const newPlatformId = event.target.value
    const params = Object.fromEntries(searchParams.entries())
    if (newPlatformId) {
      params.platform_id = newPlatformId
    } else {
      delete params.platform_id
    }
    params.page = '1'
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries())
    params.page = newPage.toString()
    setSearchParams(params)
  }

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedPackage(null)
  }

  const handleOrderPackage = (pkg) => {
    console.log('Order package', pkg)
    setShowDetailsModal(false)
    setSelectedPackage(null)
  }

  const renderPagination = () => {
    if (!meta.last_page || meta.last_page <= 1) return null

    const items = []
    const maxVisiblePages = 5
    const lastPage = meta.last_page

    // أول صفحة
    items.push(
      <Pagination.First
        key="first"
        disabled={page === 1}
        onClick={() => handlePageChange(1)}
        title={locale === 'ar' ? 'أول صفحة' : 'First page'}
      />,
    )

    // الصفحة السابقة
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={page === 1}
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        title={locale === 'ar' ? 'السابقة' : 'Previous'}
      />,
    )

    // حساب نطاق الصفحات
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // إضافة صفحات قبل النطاق بـ ...
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          onClick={() => handlePageChange(1)}
          active={page === 1}
        >
          1
        </Pagination.Item>,
      )

      if (startPage > 2) {
        items.push(
          <Pagination.Ellipsis key="ellipsis-start" disabled />,
        )
      }
    }

    // إضافة الصفحات في النطاق
    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex += 1) {
      items.push(
        <Pagination.Item
          key={pageIndex}
          active={pageIndex === page}
          onClick={() => handlePageChange(pageIndex)}
        >
          {pageIndex}
        </Pagination.Item>,
      )
    }

    // إضافة صفحات بعد النطاق بـ ...
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        items.push(
          <Pagination.Ellipsis key="ellipsis-end" disabled />,
        )
      }

      items.push(
        <Pagination.Item
          key={lastPage}
          onClick={() => handlePageChange(lastPage)}
          active={page === lastPage}
        >
          {lastPage}
        </Pagination.Item>,
      )
    }

    // الصفحة التالية
    items.push(
      <Pagination.Next
        key="next"
        disabled={page === lastPage}
        onClick={() => handlePageChange(Math.min(lastPage, page + 1))}
        title={locale === 'ar' ? 'التالية' : 'Next'}
      />,
    )

    // آخر صفحة
    items.push(
      <Pagination.Last
        key="last"
        disabled={page === lastPage}
        onClick={() => handlePageChange(lastPage)}
        title={locale === 'ar' ? 'آخر صفحة' : 'Last page'}
      />,
    )

    return <Pagination>{items}</Pagination>
  }


  return (
    <Container className="py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1>{locale === 'ar' ? 'الباقات' : 'Packages'}</h1>
          <p className="text-muted mb-0">
            {locale === 'ar'
              ? 'ابحث عن الحزم، صنفها حسب المنصة، وانتقل بين الصفحات.'
              : 'Search packages, filter by platform, and browse paginated results.'}
          </p>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Form.Group controlId="package-search">
            <Form.Label>{locale === 'ar' ? 'البحث' : 'Search'}</Form.Label>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder={locale === 'ar' ? 'ابحث باسم الحزمة أو الوصف' : 'Search by package name or description'}
                value={search}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary" onClick={() => handleSearchChange({ target: { value: '' } })}>
                {locale === 'ar' ? 'مسح' : 'Clear'}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="platform-filter">
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

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          <span>{locale === 'ar' ? 'جارٍ تحميل الحزم...' : 'Loading packages...'}</span>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <PackageList packages={packages} loading={loading} error={error} locale={locale} t={t} onViewPackage={handleViewPackage} />
          <div className="d-flex justify-content-center mt-4">{renderPagination()}</div>
        </>
      )}

      <PackageDetailsModal
        pkg={selectedPackage}
        show={showDetailsModal}
        onClose={handleCloseModal}
        onOrder={handleOrderPackage}
        locale={locale}
        t={t}
      />
    </Container>
  )
}

export default PackagesPage
