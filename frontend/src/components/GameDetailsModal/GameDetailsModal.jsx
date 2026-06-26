import { Modal, Button, Badge, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faCode, faDownload, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

function GameDetailsModal({ show, onHide, item, locale }) {
  if (!item) {
    return null
  }

  const isGame = item.type === 'game'
  const platformName = locale === 'ar'
    ? item.platform?.name_ar || item.platform?.name_en
    : item.platform?.name_en || item.platform?.name_ar
  const categoryName = locale === 'ar'
    ? item.category?.name_ar || item.category?.name_en
    : item.category?.name_en || item.category?.name_ar
  const name = locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar
  const description = locale === 'ar'
    ? item.description_ar || item.description_en || (locale === 'ar' ? 'لا يوجد وصف' : 'No description')
    : item.description_en || item.description_ar || (locale === 'ar' ? 'لا يوجد وصف' : 'No description')
  const sizeLabel = item.size_gb ? `${Number(item.size_gb).toFixed(1)} GB` : (locale === 'ar' ? 'غير متوفر' : 'Unavailable')

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge bg={isGame ? 'primary' : 'indigo'} className="me-2 py-1 px-2" style={isGame ? {} : { background: '#6366f1' }}>
            <FontAwesomeIcon icon={isGame ? faGamepad : faCode} className="me-1" />
            {isGame ? (locale === 'ar' ? 'لعبة' : 'Game') : (locale === 'ar' ? 'برنامج' : 'Program')}
          </Badge>
          {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h6>{locale === 'ar' ? 'المنصة' : 'Platform'}</h6>
              <Badge bg="secondary">{platformName || '-'}</Badge>
            </div>
            <div className="mb-3">
              <h6>{locale === 'ar' ? 'التصنيف' : 'Category'}</h6>
              <Badge bg="info">{categoryName || '-'}</Badge>
            </div>
            <div className="mb-3">
              <h6>{locale === 'ar' ? 'الحجم' : 'Size'}</h6>
              <p className="mb-0">{sizeLabel}</p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h6>
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                {locale === 'ar' ? 'التحميلات' : 'Downloads'}
              </h6>
              <p className="mb-0">{item.downloads ?? 0}</p>
            </div>
            <div className="mb-3">
              <h6>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                {locale === 'ar' ? 'تاريخ الإصدار' : 'Release date'}
              </h6>
              <p className="mb-0">{item.date_release ? new Date(item.date_release).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '-'}</p>
            </div>
          </Col>
        </Row>
        <div className="mt-4">
          <h6>{locale === 'ar' ? 'الوصف' : 'Description'}</h6>
          <p className="text-muted">{description}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {locale === 'ar' ? 'إغلاق' : 'Close'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default GameDetailsModal
