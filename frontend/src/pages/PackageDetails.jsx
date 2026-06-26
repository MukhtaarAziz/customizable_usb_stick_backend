import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap'

function PackageDetails({ locale, t }) {
  const { id } = useParams()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)

    async function loadPackage() {
      try {
        const response = await fetch(`/api/game-packages/${id}`)
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'لم نتمكن من العثور على هذه الحزمة.' : 'Unable to load this package.')
        }

        const data = await response.json()
        setPkg(data)
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الحزمة.' : 'Something went wrong while loading the package.'))
      } finally {
        setLoading(false)
      }
    }

    loadPackage()
  }, [id, locale])

  const packageName = pkg
    ? locale === 'ar'
      ? pkg.name_ar || pkg.name_en
      : pkg.name_en || pkg.name_ar
    : ''

  const packageDescription = pkg
    ? locale === 'ar'
      ? pkg.description_ar || pkg.description_en || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
      : pkg.description_en || pkg.description_ar || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
    : ''

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">{packageName || (locale === 'ar' ? 'تفاصيل الحزمة' : 'Package Details')}</h1>
          <p className="text-muted mb-0">
            {locale === 'ar'
              ? 'يمكنك العودة إلى الصفحة السابقة أو متابعة إعداد الطلب.'
              : 'You can return to the previous page or continue preparing your order.'}
          </p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          {locale === 'ar' ? 'عودة' : 'Back'}
        </Button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          <span>{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</span>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && pkg && (
        <>
          <div className="mb-4">
            <Badge bg="secondary" className="me-2">
              {pkg.platform
                ? locale === 'ar'
                  ? pkg.platform.name_ar || pkg.platform.name_en
                  : pkg.platform.name_en || pkg.platform.name_ar
                : locale === 'ar'
                  ? 'منصة غير معروفة'
                  : 'Unknown platform'}
            </Badge>
            <Badge bg="info">
              {pkg.games?.length ?? 0} {locale === 'ar' ? 'ألعاب' : 'games'}
            </Badge>
          </div>

          <p className="lead">{packageDescription}</p>

          <ListGroup className="mb-4">
            <ListGroup.Item active>{locale === 'ar' ? 'ألعاب الحزمة' : 'Package Games'}</ListGroup.Item>
            {pkg.games?.length ? (
              pkg.games.map((game) => (
                <ListGroup.Item key={game.id}>
                  {locale === 'ar' ? game.name_ar || game.name_en : game.name_en || game.name_ar}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>{locale === 'ar' ? 'لا توجد ألعاب مرتبطة.' : 'No associated games.'}</ListGroup.Item>
            )}
          </ListGroup>

          <div className="d-flex gap-3 flex-wrap">
            <Button variant="primary" onClick={() => navigate('/packages')}>
              {locale === 'ar' ? 'رجوع إلى الباقات' : 'Back to packages'}
            </Button>
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              {locale === 'ar' ? 'عودة' : 'Back'}
            </Button>
          </div>
        </>
      )}
    </Container>
  )
}

export default PackageDetails
