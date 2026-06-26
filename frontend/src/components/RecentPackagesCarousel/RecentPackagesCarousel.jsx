import { useState, useEffect } from 'react'
import { Carousel, Container, Badge, Button } from 'react-bootstrap'
import './RecentPackagesCarousel.css'

function RecentPackagesCarousel({ locale, t, onViewPackage }) {
  const [recentPackages, setRecentPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadRecentPackages() {
      try {
        const response = await fetch('/api/game-packages?per_page=100')
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل الحزم الحديثة.' : 'Unable to load recent packages.')
        }

        const data = await response.json()
        const packages = data.data ?? data
        
        // الحصول على آخر 5 حزم (مرتبة بناءً على id بشكل عكسي أو created_at)
        const recent = Array.isArray(packages) ? packages.slice(0, 5) : []
        setRecentPackages(recent)
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الحزم.' : 'Something went wrong.'))
      } finally {
        setLoading(false)
      }
    }

    loadRecentPackages()
  }, [locale])

  if (loading) {
    return (
      <section className="recent-packages-carousel py-5 bg-light">
        <Container>
          <div className="text-center">
            <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </Container>
      </section>
    )
  }

  if (error || recentPackages.length === 0) {
    return null
  }

  const getName = (pkg) => locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
  const getDescription = (pkg) => {
    const desc = locale === 'ar' ? pkg.description_ar || pkg.description_en : pkg.description_en || pkg.description_ar
    return desc ? desc.substring(0, 100) + '...' : ''
  }
  const getPlatformName = (pkg) => {
    if (!pkg.platform) return ''
    return locale === 'ar' ? pkg.platform.name_ar || pkg.platform.name_en : pkg.platform.name_en || pkg.platform.name_ar
  }

  return (
    <section className="recent-packages-carousel py-5 bg-light">
      <Container>
        <div className="text-center mb-4">
          <p className="text-uppercase text-secondary mb-2">{locale === 'ar' ? 'جديد' : 'Latest'}</p>
          <h2 className="fw-bold">{locale === 'ar' ? 'الحزم المضافة حديثاً' : 'Recently Added Packages'}</h2>
        </div>

        <Carousel 
          pause="hover" 
          indicators={recentPackages.length > 1}
          interval={5000}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="carousel-container"
        >
          {recentPackages.map((pkg, index) => (
            <Carousel.Item key={pkg.id || index}>
              <div className="carousel-slide">
                <div className="carousel-content">
                  <div className="carousel-text">
                    <h3 className="carousel-title">{getName(pkg)}</h3>
                    {pkg.platform && (
                      <Badge bg="secondary" className="mb-3">
                        {getPlatformName(pkg)}
                      </Badge>
                    )}
                    <p className="carousel-description mt-3">
                      {getDescription(pkg)}
                    </p>
                    <div className="carousel-stats mt-3 mb-3">
                      <span className="stat-item">
                        <strong>{pkg.games?.length ?? 0}</strong>{' '}
                        {locale === 'ar' ? 'ألعاب' : 'Games'}
                      </span>
                      <span className="stat-item ms-3">
                        <strong>{pkg.views ?? 0}</strong>{' '}
                        {locale === 'ar' ? 'عرض' : 'Views'}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onViewPackage?.(pkg)}
                    >
                      {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>

                  {pkg.image && (
                    <div className="carousel-image">
                      <img 
                        src={pkg.image} 
                        alt={getName(pkg)}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  )
}

export default RecentPackagesCarousel
