import { Card, Badge, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGamepad,
  faCar,
  faFutbol,
  faCrosshairs,
  faDragon,
  faHdd,
  faDownload,
  faCalendarAlt,
  faCheck,
  faPlus,
  faEye,
  faLayerGroup,
  faMicrochip
} from '@fortawesome/free-solid-svg-icons'
import './GameCard.css'

function GameCard({ game, locale, viewMode, onView, onAdd, added }) {
  const platformName = locale === 'ar'
    ? game.platform?.name_ar || game.platform?.name_en
    : game.platform?.name_en || game.platform?.name_ar
  const categoryName = locale === 'ar'
    ? game.category?.name_ar || game.category?.name_en
    : game.category?.name_en || game.category?.name_ar
  const name = locale === 'ar' ? game.name_ar || game.name_en : game.name_en || game.name_ar
  const description = locale === 'ar'
    ? game.description_ar || game.description_en || 'لا يوجد وصف متاح لهذه اللعبة.'
    : game.description_en || game.description_ar || 'No description available for this game.'
  const sizeLabel = game.size_gb ? `${Number(game.size_gb).toFixed(1)} GB` : (locale === 'ar' ? 'غير متوفر' : 'N/A')

  // Get category-specific details
  const getCategoryDetails = (catNameEn) => {
    const nameLower = String(catNameEn).toLowerCase()
    if (nameLower.includes('action') || nameLower.includes('أكشن')) {
      return {
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
        icon: faCrosshairs,
        shadow: 'rgba(244, 63, 94, 0.15)'
      }
    } else if (nameLower.includes('sport') || nameLower.includes('رياضة')) {
      return {
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        icon: faFutbol,
        shadow: 'rgba(16, 185, 129, 0.15)'
      }
    } else if (nameLower.includes('racing') || nameLower.includes('سباق')) {
      return {
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
        icon: faCar,
        shadow: 'rgba(245, 158, 11, 0.15)'
      }
    } else if (nameLower.includes('rpg')) {
      return {
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
        icon: faDragon,
        shadow: 'rgba(139, 92, 246, 0.15)'
      }
    } else {
      return {
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        icon: faGamepad,
        shadow: 'rgba(59, 130, 246, 0.15)'
      }
    }
  }

  const catDetails = getCategoryDetails(game.category?.name_en || '')

  const hasImage = game.images && game.images.length > 0
  const releaseYear = game.date_release ? new Date(game.date_release).getFullYear() : null

  return (
    <Card className={`game-card h-100 ${viewMode === 'list' ? 'game-card--list' : ''} ${added ? 'game-card--added' : ''}`} style={{ '--card-shadow': catDetails.shadow }}>

      {/* Visual Header / Cover Image */}
      <div className="game-card__header" style={{ background: catDetails.gradient }}>
        {hasImage ? (
          <img
            className="game-card__image"
            src={`/api/games/${game.id}/images/${game.images[0].id}/thumbnail`}
            alt={name}
            loading="lazy"
          />
        ) : (
          <div className="game-card__placeholder">
            <FontAwesomeIcon icon={catDetails.icon} className="game-card__placeholder-icon" />
          </div>
        )}
      </div>

      <Card.Body className="game-card__body p-0 d-flex flex-column">
        <div className="game-card__content p-3 d-flex align-items-center justify-content-center flex-grow-1 text-center">
          <Card.Title className="game-card__title mb-0">{name}</Card.Title>
        </div>

        <div className="game-card__footer-container bg-light d-flex flex-column gap-2 p-3 mt-auto">
          <div className="game-card__tags d-flex flex-wrap justify-content-center gap-1">
            <Badge bg="white" text="dark" className="border shadow-sm fw-normal">
              <FontAwesomeIcon icon={faHdd} className={locale === 'ar' ? 'ms-1 text-muted' : 'me-1 text-muted'} />
              {sizeLabel}
            </Badge>
            <Badge bg="white" text="dark" className="border shadow-sm fw-normal">
              <FontAwesomeIcon icon={faMicrochip} className={locale === 'ar' ? 'ms-1 text-muted' : 'me-1 text-muted'} />
              {platformName || 'Platform'}
            </Badge>
            <Badge bg="white" text="dark" className="border shadow-sm fw-normal">
              <FontAwesomeIcon icon={faLayerGroup} className={locale === 'ar' ? 'ms-1 text-muted' : 'me-1 text-muted'} />
              {categoryName || 'Category'}
            </Badge>
          </div>

          <div className="game-card__actions d-flex justify-content-center gap-2 mt-2">
            <Button
              variant="outline-primary"
              className="game-card__btn-view-icon"
              onClick={() => onView(game)}
              title={locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              aria-label="View Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>

            <Button
              variant={added ? 'success' : 'primary'}
              className={`game-card__btn-add-icon ${added ? 'disabled-success' : ''}`}
              onClick={() => onAdd(game)}
              disabled={added}
              title={added ? (locale === 'ar' ? 'تمت الإضافة' : 'Added') : (locale === 'ar' ? 'إضافة للفلاش' : 'Add to USB')}
              aria-label={added ? "Added" : "Add to USB"}
            >
              <FontAwesomeIcon icon={added ? faCheck : faPlus} className={added ? 'animate-pop' : ''} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default GameCard
