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
  faMicrochip,
  faCode,
  faPalette,
  faShieldHalved,
  faWrench,
  faFileLines,
  faHeadphones
} from '@fortawesome/free-solid-svg-icons'
import './GameCard.css'

const programCategoryIcons = {
  office: faFileLines,
  design: faPalette,
  development: faCode,
  multimedia: faHeadphones,
  security: faShieldHalved,
  utility: faWrench,
}

function GameCard({ item, locale, viewMode, onView, onAdd, added }) {
  const platformName = locale === 'ar'
    ? item.platform?.name_ar || item.platform?.name_en
    : item.platform?.name_en || item.platform?.name_ar
  const categoryName = locale === 'ar'
    ? item.category?.name_ar || item.category?.name_en
    : item.category?.name_en || item.category?.name_ar
  const name = locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar
  const description = locale === 'ar'
    ? item.description_ar || item.description_en || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
    : item.description_en || item.description_ar || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
  const sizeLabel = item.size_gb ? `${Number(item.size_gb).toFixed(1)} GB` : (locale === 'ar' ? 'غير متوفر' : 'N/A')
  const isGame = item.type === 'game'

  const getCategoryDetails = (catNameEn, type) => {
    const nameLower = String(catNameEn).toLowerCase()
    if (type === 'program') {
      const icon = programCategoryIcons[Object.keys(programCategoryIcons).find(k => nameLower.includes(k))] || faCode
      return {
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
        icon,
        shadow: 'rgba(99, 102, 241, 0.15)'
      }
    }
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

  const catDetails = getCategoryDetails(item.category?.name_en || '', item.type)

  const hasImage = item.images && item.images.length > 0
  const imageUrl = hasImage
    ? `/api/${isGame ? 'games' : 'programs'}/${item.id}/images/${item.images[0].id}/thumbnail`
    : null

  return (
    <Card className={`game-card h-100 ${viewMode === 'list' ? 'game-card--list' : ''} ${added ? 'game-card--added' : ''}`} style={{ '--card-shadow': catDetails.shadow }}>

      {/* Visual Header / Cover Image */}
      <div className="game-card__header" style={{ background: catDetails.gradient }}>
        {hasImage ? (
          <img
            className="game-card__image"
            src={imageUrl}
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
              <Badge bg={isGame ? 'primary' : 'indigo'} className={`me-1 py-0 px-1 ${isGame ? 'bg-primary' : ''}`} style={isGame ? {} : { background: '#6366f1' }}>
                {isGame ? (locale === 'ar' ? 'لعبة' : 'Game') : (locale === 'ar' ? 'برنامج' : 'App')}
              </Badge>
            </Badge>
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
              onClick={() => onView(item)}
              title={locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              aria-label="View Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>

            <Button
              variant={added ? 'success' : 'primary'}
              className={`game-card__btn-add-icon ${added ? 'disabled-success' : ''}`}
              onClick={() => onAdd(item)}
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
