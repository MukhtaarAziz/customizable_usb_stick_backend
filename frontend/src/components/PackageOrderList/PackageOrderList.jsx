import { Card, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faCube,
  faMapMarkerAlt,
  faPhone,
  faUser,
  faTimes,
  faStickyNote
} from '@fortawesome/free-solid-svg-icons'
import './PackageOrderList.css'

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

function PackageOrderList({ orders, locale, loading, error }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">
          {locale === 'ar' ? 'جارٍ تحميل طلبات الباقات...' : 'Loading package orders...'}
        </p>
      </div>
    )
  }

  if (orders && orders.length > 0) {
    return (
      <div className="package-order-list">
        {orders.map((order) => {
          if (!order || !order.id) {
            return null
          }

          const status = statusConfig[order.status] || statusConfig.pending

          return (
            <Card key={order.id} className="package-order-card mb-3 shadow-sm">
              <Card.Body>
                <div className="package-order-card__header d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {locale === 'ar' ? 'طلب باقة رقم' : 'Package Order #'} {order.id}
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
                  <Badge bg={status.variant} className="package-order-status-badge">
                    {status.icon && <FontAwesomeIcon icon={status.icon} className={locale === 'ar' ? 'ms-1' : 'me-1'} />}
                    {status.label[locale]}
                  </Badge>
                </div>

                <Row className="g-3">
                  {order.items && order.items.length > 0 && (
                    <Col xs={12}>
                      <div className="package-order-items-section">
                        <small className="text-muted d-block mb-2 fw-semibold">
                          {locale === 'ar' ? 'الباقات المطلوبة' : 'Ordered Packages'}
                        </small>
                        {order.items.map((item) => {
                          const pkg = item.package
                          const pkgName = pkg
                            ? (locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar)
                            : (locale === 'ar' ? 'باقة' : 'Package')
                          const lineTotal = Number(item.unit_price) * item.quantity

                          return (
                            <div key={item.id} className="package-order-item mb-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-center gap-2">
                                  <FontAwesomeIcon icon={faCube} className="text-primary" />
                                  <div>
                                    <span className="fw-semibold">{pkgName}</span>
                                    <span className="text-muted small ms-2">
                                      {item.quantity} <FontAwesomeIcon icon={faTimes} className="mx-1" />
                                      {Number(item.unit_price).toLocaleString()} IQD
                                    </span>
                                  </div>
                                </div>
                                <span className="fw-bold">{lineTotal.toLocaleString()} IQD</span>
                              </div>
                              {item.notes && (
                                <div className="package-order-item-notes mt-1">
                                  <FontAwesomeIcon icon={faStickyNote} className="text-muted me-1" />
                                  <small className="text-muted">{item.notes}</small>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </Col>
                  )}

                  {order.total_price > 0 && (
                    <Col xs={12}>
                      <div className="d-flex justify-content-between align-items-center py-2 border-top">
                        <span className="fw-bold">{locale === 'ar' ? 'المجموع الكلي' : 'Total'}:</span>
                        <span className="fw-bold fs-5 text-primary">
                          {Number(order.total_price).toLocaleString()} IQD
                        </span>
                      </div>
                    </Col>
                  )}

                  {order.delivery_address && (
                    <Col xs={12} md={6}>
                      <div className="package-order-detail-item">
                        <div className="package-order-detail-item__icon">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <div className="package-order-detail-item__content">
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
                      <div className="package-order-detail-item">
                        <div className="package-order-detail-item__icon">
                          <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className="package-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                          </small>
                          <p className="fw-semibold mb-0" dir="ltr">{order.phone}</p>
                        </div>
                      </div>
                    </Col>
                  )}

                  {order.customer_name && (
                    <Col xs={12} md={6}>
                      <div className="package-order-detail-item">
                        <div className="package-order-detail-item__icon">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="package-order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'اسم العميل' : 'Customer Name'}
                          </small>
                          <p className="fw-semibold mb-0">{order.customer_name}</p>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
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
        {locale === 'ar' ? 'حدث خطأ أثناء تحميل طلبات الباقات' : 'Error loading package orders'}
        <br />
        <small>{error}</small>
      </Alert>
    )
  }

  return (
    <Alert variant="info" className="text-center">
      <FontAwesomeIcon icon={faBox} size="2x" className="mb-3" />
      <p>
        {locale === 'ar' ? 'لا توجد طلبات باقات حتى الآن' : 'No package orders yet'}
      </p>
    </Alert>
  )
}

export default PackageOrderList
