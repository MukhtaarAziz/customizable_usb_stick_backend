import { useNavigate } from 'react-router-dom'
import { Card, Badge, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faCheck, faTag } from '@fortawesome/free-solid-svg-icons'
import './PackageCard.css'

function PackageCard({ pkg, locale, t, onView, onAddToCart, isInCart }) {
  const navigate = useNavigate()
  const platformName = locale === 'ar'
    ? pkg.platform?.name_ar || pkg.platform?.name_en
    : pkg.platform?.name_en || pkg.platform?.name_ar
  const gamesCount = pkg.games?.length ?? 0
  const programsCount = pkg.programs?.length ?? 0
  const itemsCount = pkg.items_count ?? 0
  const name = locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
  const description = locale === 'ar'
    ? pkg.description_ar || pkg.description_en || 'No description available.'
    : pkg.description_en || pkg.description_ar || 'No description available.'
  const imageUrl = pkg.cover?.path
    ? `https://via.placeholder.com/600x350?text=${encodeURIComponent(name || t.general)}`
    : `https://via.placeholder.com/600x350?text=${encodeURIComponent(t.general)}`
  const hasDiscount = pkg.discount > 0
  const discountPercent = Math.round(pkg.discount * 100)

  const handleViewPackage = () => {
    if (typeof onView === 'function') {
      onView(pkg)
      return
    }

    navigate(`/packages/${pkg.id}`)
  }

  const handleAddToCartClick = (e) => {
    e.stopPropagation()
    if (typeof onAddToCart === 'function') {
      onAddToCart(pkg)
    }
  }

  return (
    <Card className="package-card h-100 shadow-sm">
      <div className="ratio ratio-16x9 position-relative">
        {hasDiscount && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2 fs-6">
            <FontAwesomeIcon icon={faTag} className="me-1" />-{discountPercent}%
          </Badge>
        )}
        <img src={imageUrl} className="card-img-top object-fit-cover" alt={name || t.general} />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="me-2">{platformName || t.general}</Badge>
          <Badge bg="info">{itemsCount} {locale === 'ar' ? 'عنصر' : 'items'}</Badge>
        </div>
        <Card.Title>{name || t.general}</Card.Title>
        <Card.Text className="flex-grow-1 text-muted">{description}</Card.Text>
        <div className="d-flex align-items-center gap-2 mb-2">
          {hasDiscount ? (
            <>
              <span className="text-decoration-line-through text-muted">{pkg.price_iqd} IQD</span>
              <span className="fs-5 fw-bold text-danger">{pkg.final_price_iqd} IQD</span>
            </>
          ) : (
            <span className="fs-5 fw-bold">{pkg.price_iqd} IQD</span>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center mt-auto">
          {typeof onAddToCart === 'function' ? (
            <Button 
              variant={isInCart ? "success" : "primary"} 
              size="sm" 
              onClick={handleAddToCartClick}
              className="btn-add-cart"
            >
              <FontAwesomeIcon icon={isInCart ? faCheck : faShoppingCart} className="me-1" />
              {isInCart 
                ? (locale === 'ar' ? 'في السلة' : 'In Cart')
                : (locale === 'ar' ? 'أضف للسلة' : 'Add to Cart')
              }
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleViewPackage}>
              {t.viewPackage}
            </Button>
          )}
          <small className="text-muted">{pkg.views ?? 0} {t.views}</small>
          <small className="text-muted">{pkg.order_count ?? 0} {t.orders}</small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PackageCard
