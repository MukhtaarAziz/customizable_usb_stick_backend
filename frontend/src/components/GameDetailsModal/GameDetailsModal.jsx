import { Modal, Button, Badge, Row, Col } from 'react-bootstrap'

function GameDetailsModal({ show, onHide, game, locale }) {
  if (!game) {
    return null
  }

  const platformName = locale === 'ar'
    ? game.platform?.name_ar || game.platform?.name_en
    : game.platform?.name_en || game.platform?.name_ar
  const categoryName = locale === 'ar'
    ? game.category?.name_ar || game.category?.name_en
    : game.category?.name_en || game.category?.name_ar
  const name = locale === 'ar' ? game.name_ar || game.name_en : game.name_en || game.name_ar
  const description = locale === 'ar'
    ? game.description_ar || game.description_en || (locale === 'ar' ? 'لا يوجد وصف' : 'No description')
    : game.description_en || game.description_ar || (locale === 'ar' ? 'لا يوجد وصف' : 'No description')
  const sizeLabel = game.size_gb ? `${Number(game.size_gb).toFixed(1)} GB` : (locale === 'ar' ? 'غير متوفر' : 'Unavailable')

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
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
              <h6>{locale === 'ar' ? 'التحميلات' : 'Downloads'}</h6>
              <p className="mb-0">{game.downloads ?? 0}</p>
            </div>
            <div className="mb-3">
              <h6>{locale === 'ar' ? 'تاريخ الإصدار' : 'Release date'}</h6>
              <p className="mb-0">{game.date_release ? new Date(game.date_release).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : '-'}</p>
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
