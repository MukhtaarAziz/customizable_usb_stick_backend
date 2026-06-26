import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Badge, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faGamepad, faEye } from '@fortawesome/free-solid-svg-icons'
import './LatestPackagesCarousel.css'

function LatestPackagesCarousel({ locale, t, onViewPackage }) {
  const [recentPackages, setRecentPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      direction: locale === 'ar' ? 'rtl' : 'ltr',
      breakpoints: {
        '(min-width: 576px)': { slidesToScroll: 1 },
        '(min-width: 992px)': { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  )

  useEffect(() => {
    async function loadRecentPackages() {
      try {
        const response = await fetch('/api/game-packages?per_page=100')
        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'تعذر تحميل الحزم الحديثة.' : 'Unable to load recent packages.')
        }
        const data = await response.json()
        const packages = data.data ?? data
        const recent = Array.isArray(packages) ? packages.slice(0, 6) : []
        setRecentPackages(recent)
      } catch (err) {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء تحميل الحزم.' : 'Something went wrong.'))
      } finally {
        setLoading(false)
      }
    }
    loadRecentPackages()
  }, [locale])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const getName = (pkg) => locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
  const getDescription = (pkg) => {
    const desc = locale === 'ar' ? pkg.description_ar || pkg.description_en : pkg.description_en || pkg.description_ar
    return desc ? desc.substring(0, 90) + '...' : ''
  }
  const getPlatformName = (pkg) => {
    if (!pkg.platform) return ''
    return locale === 'ar' ? pkg.platform.name_ar || pkg.platform.name_en : pkg.platform.name_en || pkg.platform.name_ar
  }

  if (loading) {
    return (
      <section className="latest-packages-carousel py-5">
        <div className="lc-container">
          <div className="text-center">
            <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || recentPackages.length === 0) return null

  return (
    <section className="latest-packages-carousel py-5">
      <div className="lc-container">
        <div className="text-center mb-4">
          <p className="text-uppercase text-secondary mb-2" style={{ fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600 }}>
            {locale === 'ar' ? 'جديد' : 'Latest'}
          </p>
          <h2 className="fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            {locale === 'ar' ? 'الحزم المضافة حديثاً' : 'Recently Added Packages'}
          </h2>
        </div>

        <div className="lc-embla">
          <div className="lc-embla__viewport" ref={emblaRef}>
            <div className="lc-embla__container">
              {recentPackages.map((pkg) => (
                <div className="lc-embla__slide" key={pkg.id}>
                  <div className="lc-card">
                    {pkg.platform && (
                      <Badge bg="secondary" className="lc-card__platform">
                        {getPlatformName(pkg)}
                      </Badge>
                    )}
                    <div className="lc-card__body">
                      <h3 className="lc-card__title">{getName(pkg)}</h3>
                      {getDescription(pkg) && (
                        <p className="lc-card__desc">{getDescription(pkg)}</p>
                      )}
                      <div className="lc-card__stats">
                        <span className="lc-card__stat">
                          <FontAwesomeIcon icon={faGamepad} className="lc-card__stat-icon" />
                          <span>{pkg.games?.length ?? 0} {locale === 'ar' ? 'لعبة' : 'Games'}</span>
                        </span>
                        <span className="lc-card__stat">
                          <FontAwesomeIcon icon={faEye} className="lc-card__stat-icon" />
                          <span>{pkg.views ?? 0} {locale === 'ar' ? 'مشاهدة' : 'Views'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="lc-card__footer">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="lc-card__btn"
                        onClick={() => onViewPackage?.(pkg)}
                      >
                        {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recentPackages.length > 1 && (
            <>
              <button className="lc-embla__btn lc-embla__btn--prev" onClick={scrollPrev} type="button">
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="lc-embla__btn lc-embla__btn--next" onClick={scrollNext} type="button">
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}
        </div>

        <div className="lc-dots">
          {recentPackages.map((_, index) => (
            <button
              key={index}
              className="lc-dots__dot"
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestPackagesCarousel
