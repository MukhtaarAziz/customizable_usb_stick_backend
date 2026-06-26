import { useNavigate } from 'react-router-dom'
import { Card, Badge, Button } from 'react-bootstrap'
import './PackageCard.css'

function PackageCard({ pkg, locale, t, onView }) {
  const navigate = useNavigate()
  const platformName = locale === 'ar'
    ? pkg.platform?.name_ar || pkg.platform?.name_en
    : pkg.platform?.name_en || pkg.platform?.name_ar
  const gamesCount = pkg.games?.length ?? 0
  const name = locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
  const description = locale === 'ar'
    ? pkg.description_ar || pkg.description_en || 'No description available.'
    : pkg.description_en || pkg.description_ar || 'No description available.'
  const imageUrl = pkg.cover?.path
    ? `https://via.placeholder.com/600x350?text=${encodeURIComponent(name || t.general)}`
    : `https://via.placeholder.com/600x350?text=${encodeURIComponent(t.general)}`

  const handleViewPackage = () => {
    if (typeof onView === 'function') {
      onView(pkg)
      return
    }

    navigate(`/packages/${pkg.id}`)
  }

  return (
    <Card className="package-card h-100 shadow-sm">
      <div className="ratio ratio-16x9">
        <img src={imageUrl} className="card-img-top object-fit-cover" alt={name || t.general} />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="me-2">{platformName || t.general}</Badge>
          <Badge bg="info">{gamesCount} {locale === 'ar' ? 'ألعاب' : 'games'}</Badge>
        </div>
        <Card.Title>{name || t.general}</Card.Title>
        <Card.Text className="flex-grow-1 text-muted">{description}</Card.Text>
        <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
          <Button variant="primary" size="sm" onClick={handleViewPackage}>
            {t.viewPackage}
          </Button>
          <small className="text-muted">{pkg.views ?? 0} {t.views}</small>
          <small className="text-muted">{pkg.order_count ?? 0} {t.orders}</small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PackageCard
