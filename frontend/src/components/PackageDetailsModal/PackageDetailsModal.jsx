import { useEffect, useState } from 'react'
import { Modal, Button, Badge, ListGroup } from 'react-bootstrap'

function PackageDetailsModal({ pkg, show, onClose, onOrder, locale, t }) {
  const [packageState, setPackageState] = useState(pkg)

  useEffect(() => {
    setPackageState(pkg)
  }, [pkg])

  if (!packageState) {
    return null
  }

  const name = locale === 'ar' ? packageState.name_ar || packageState.name_en : packageState.name_en || packageState.name_ar
  const description = locale === 'ar'
    ? packageState.description_ar || packageState.description_en || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
    : packageState.description_en || packageState.description_ar || (locale === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')
  const platformName = packageState.platform
    ? locale === 'ar'
      ? packageState.platform.name_ar || packageState.platform.name_en
      : packageState.platform.name_en || packageState.platform.name_ar
    : locale === 'ar'
      ? 'منصة غير معروفة'
      : 'Unknown platform'

  return (
    <Modal show={show} onHide={onClose} centered dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Modal.Header closeButton className={locale === 'ar' ? 'justify-content-between flex-row-reverse' : ''}>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
        <Badge bg="secondary" className="mb-2 d-inline-block">
          {platformName}
        </Badge>
        <p className="mt-3">{description}</p>

        <ListGroup className="mb-3">
          <ListGroup.Item active>{locale === 'ar' ? 'تفاصيل الحزمة' : 'Package details'}</ListGroup.Item>
          <ListGroup.Item style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {locale === 'ar' ? 'عدد الألعاب' : 'Games count'}: {packageState.games?.length ?? 0}
          </ListGroup.Item>
          <ListGroup.Item style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {locale === 'ar' ? 'عدد المشاهدات' : 'Views'}: {packageState.views ?? 0}
          </ListGroup.Item>
          <ListGroup.Item style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {locale === 'ar' ? 'طلبات' : 'Orders'}: {packageState.order_count ?? 0}
          </ListGroup.Item>
        </ListGroup>

        <div className={`d-flex gap-2 flex-wrap ${locale === 'ar' ? 'flex-row-reverse justify-content-end' : ''}`}>
          <Button variant="primary" onClick={() => onOrder?.(packageState)}>
            {locale === 'ar' ? 'اطلب الحزمة' : 'Order package'}
          </Button>
          <Button variant="outline-secondary" onClick={onClose}>
            {locale === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PackageDetailsModal
