import { Card, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHardDrive,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faBox,
  faGamepad,
  faCode,
  faMapMarkerAlt,
  faPhone,
  faTimes,
  faStickyNote
} from '@fortawesome/free-solid-svg-icons'
import './StorageDeviceOrderList.css'

const statusConfig = {
  pending: {
    icon: faClock,
    variant: 'warning',
    label: { en: 'Pending', ar: 'قيد الانتظار' }
  },
  processing: {
    icon: faExclamationTriangle,
    variant: 'info',
    label: { en: 'Processing', ar: 'قيد المعالجة' }
  },
  shipped: {
    icon: faBox,
    variant: 'primary',
    label: { en: 'Shipped', ar: 'تم الإرسال' }
  },
  delivered: {
    icon: faCheckCircle,
    variant: 'success',
    label: { en: 'Delivered', ar: 'تم الاستلام' }
  },
  cancelled: {
    icon: faExclamationTriangle,
    variant: 'danger',
    label: { en: 'Cancelled', ar: 'ملغى' }
  }
}

function StorageDeviceOrderList({ orders, locale, loading, error }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">
          {locale === 'ar' ? 'جارٍ تحميل طلبات أجهزة التخزين...' : 'Loading storage device orders...'}
        </p>
      </div>
    )
  }

  if (orders && orders.length > 0) {
    return (
      <div className="storage-device-order-list">
        {orders.map((order) => {
          if (!order || !order.id) {
            return null
          }

          const status = statusConfig[order.status] || statusConfig.pending
          const deviceName = order.storage_device
            ? (locale === 'ar' ? order.storage_device.name_ar || order.storage_device.name_en : order.storage_device.name_en || order.storage_device.name_ar)
            : (locale === 'ar' ? 'جهاز تخزين' : 'Storage Device')

          return (
            <Card key={order.id} className="storage-device-order-card mb-3 shadow-sm">
              <Card.Body>
                <div className="storage-device-order-card__header d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {locale === 'ar' ? 'طلب جهاز تخزين رقم' : 'Storage Device Order #'} {order.id}
                    </h6>
                    <small className="text-muted">
                      {order.created_at
                        ? (() => {
                            try {
                              return new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            } catch (e) {
                              return '-'
                            }
                          })()
                        : '-'}
                    </small>
                  </div>
                  <Badge bg={status.variant} className="storage-device-order-status-badge">
                    {status.icon && <FontAwesomeIcon icon={status.icon} className={locale === 'ar' ? 'ms-1' : 'me-1'} />}
                    {status.label[locale]}
                  </Badge>
                </div>

                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <div className="storage-device-order-detail-item">
                      <div className="storage-device-order-detail-item__icon">
                        <FontAwesomeIcon icon={faHardDrive} />
                      </div>
                      <div className="storage-device-order-detail-item__content">
                        <small className="text-muted d-block">
                          {locale === 'ar' ? 'جهاز التخزين' : 'Storage Device'}
                        </small>
                        <p className="fw-semibold mb-0">{deviceName}</p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className="storage-device-order-detail-item">
                      <div className="storage-device-order-detail-item__icon">
                        <FontAwesomeIcon icon={faBox} />
                      </div>
                      <div className="storage-device-order-detail-item__content">
                        <small className="text-muted d-block">
                          {locale === 'ar' ? 'الكمية والسعر' : 'Qty & Price'}
                        </small>
                        <p className="fw-semibold mb-0">
                          {order.quantity} <FontAwesomeIcon icon={faTimes} className="mx-1" />
                          {Number(order.unit_price || 0).toLocaleString()} IQD
                        </p>
                        <small className="text-muted">
                          {locale === 'ar' ? 'المجموع' : 'Total'}: <strong>{Number(order.total_price || 0).toLocaleString()} IQD</strong>
                        </small>
                      </div>
                    </div>
                  </Col>

                  {order.games && order.games.length > 0 && (
                    <Col xs={12} md={6}>
                      <div className="storage-device-order-detail-item">
                        <div className="storage-device-order-detail-item__icon">
                          <FontAwesomeIcon icon={faGamepad} />
                        </div>
                        <div className="storage-device-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'الألعاب' : 'Games'}
                          </small>
                          <p className="fw-semibold mb-0">
                            {order.games.map((g) => locale === 'ar' ? g.name_ar || g.name_en : g.name_en || g.name_ar).join(', ')}
                          </p>
                        </div>
                      </div>
                    </Col>
                  )}

                  {order.programs && order.programs.length > 0 && (
                    <Col xs={12} md={6}>
                      <div className="storage-device-order-detail-item">
                        <div className="storage-device-order-detail-item__icon">
                          <FontAwesomeIcon icon={faCode} />
                        </div>
                        <div className="storage-device-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'البرامج' : 'Programs'}
                          </small>
                          <p className="fw-semibold mb-0">
                            {order.programs.map((p) => locale === 'ar' ? p.name_ar || p.name_en : p.name_en || p.name_ar).join(', ')}
                          </p>
                        </div>
                      </div>
                    </Col>
                  )}

                  {order.delivery_address && (
                    <Col xs={12} md={6}>
                      <div className="storage-device-order-detail-item">
                        <div className="storage-device-order-detail-item__icon">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <div className="storage-device-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
                          </small>
                          <p className="fw-semibold mb-0 small">{order.delivery_address}</p>
                        </div>
                      </div>
                    </Col>
                  )}

                  {order.phone && (
                    <Col xs={12} md={6}>
                      <div className="storage-device-order-detail-item">
                        <div className="storage-device-order-detail-item__icon">
                          <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className="storage-device-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                          </small>
                          <p className="fw-semibold mb-0" dir="ltr">{order.phone}</p>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>

                {order.custom_message && (
                  <div className="storage-device-order-message mt-3 p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">
                      {locale === 'ar' ? 'رسالة مخصصة' : 'Custom Message'}
                    </small>
                    <p className="mb-0 fst-italic">"{order.custom_message}"</p>
                  </div>
                )}

                {order.notes && (
                  <div className="storage-device-order-notes mt-2">
                    <small className="text-muted">
                      <FontAwesomeIcon icon={faStickyNote} className={locale === 'ar' ? 'ms-1' : 'me-1'} />
                      {order.notes}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          )
        })}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        {locale === 'ar' ? 'حدث خطأ أثناء تحميل طلبات أجهزة التخزين' : 'Error loading storage device orders'}
        <br />
        <small>{error}</small>
      </Alert>
    )
  }

  return (
    <Alert variant="info" className="text-center">
      <FontAwesomeIcon icon={faHardDrive} size="2x" className="mb-3" />
      <p>
        {locale === 'ar' ? 'لا توجد طلبات أجهزة تخزين حتى الآن' : 'No storage device orders yet'}
      </p>
    </Alert>
  )
}

export default StorageDeviceOrderList
