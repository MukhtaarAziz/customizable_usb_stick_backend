import { useState, useEffect } from 'react'
import { Card, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBox, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle,
  faGamepad,
  faHdd,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import './OrderList.css'

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

function OrderList({ orders, locale, loading, error }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">
          {locale === 'ar' ? 'جارٍ تحميل الطلبات...' : 'Loading orders...'}
        </p>
      </div>
    )
  }

  // If we have orders, show them even if there was an error
  if (orders && orders.length > 0) {
    return (
      <div className="order-list">
        {orders.map((order) => {
          // Skip invalid orders
          if (!order || !order.id) {
            return null
          }
          
          const status = statusConfig[order.status] || statusConfig.pending
          
          return (
            <Card key={order.id} className="order-card mb-3 shadow-sm">
              <Card.Body>
                {/* Order Header */}
                <div className="order-card__header d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {locale === 'ar' ? 'طلب رقم' : 'Order #'} {order.id}
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
                  <Badge bg={status.variant} className="order-status-badge">
                    {status.icon && <FontAwesomeIcon icon={status.icon} className={locale === 'ar' ? 'ms-1' : 'me-1'} />}
                    {status.label[locale]}
                  </Badge>
                </div>

                {/* Order Details */}
                <Row className="g-3">
                  {/* USB Stick Info */}
                  <Col xs={12} md={6}>
                    <div className="order-detail-item">
                      <div className="order-detail-item__icon">
                        <FontAwesomeIcon icon={faHdd} />
                      </div>
                      <div className="order-detail-item__content">
                        <small className="text-muted d-block">
                          {locale === 'ar' ? 'الفلاش الميموري' : 'USB Stick'}
                        </small>
                        <p className="fw-semibold mb-0">
                          {order.usb_stick && (order.usb_stick.name_ar || order.usb_stick.name_en)
                            ? (locale === 'ar' 
                                ? order.usb_stick.name_ar || order.usb_stick.name_en 
                                : order.usb_stick.name_en || order.usb_stick.name_ar)
                            : (locale === 'ar' ? 'غير محدد' : 'N/A')}
                        </p>
                        <small className="text-muted">
                          {order.usb_stick && order.usb_stick.size_gb 
                            ? `${order.usb_stick.size_gb} GB • USB ${order.usb_stick.interface || 'N/A'}` 
                            : '-'}
                        </small>
                      </div>
                    </div>
                  </Col>

                  {/* Price */}
                  <Col xs={12} md={6}>
                    <div className="order-detail-item">
                      <div className="order-detail-item__icon">
                        <FontAwesomeIcon icon={faGamepad} />
                      </div>
                      <div className="order-detail-item__content">
                        <small className="text-muted d-block">
                          {locale === 'ar' ? 'السعر الإجمالي' : 'Total Price'}
                        </small>
                        <p className="fw-bold text-primary mb-0">
                          {order.total_price && Number(order.total_price) > 0 
                            ? `${Number(order.total_price).toLocaleString()} IQD` 
                            : (locale === 'ar' ? 'غير محدد' : 'N/A')}
                        </p>
                      </div>
                    </div>
                  </Col>

                  {/* Games Count */}
                  <Col xs={12} md={6}>
                    <div className="order-detail-item">
                      <div className="order-detail-item__icon">
                        <FontAwesomeIcon icon={faGamepad} />
                      </div>
                      <div className="order-detail-item__content">
                        <small className="text-muted d-block">
                          {locale === 'ar' ? 'عدد الألعاب' : 'Games Count'}
                        </small>
                        <p className="fw-semibold mb-0">
                          {(order.games && Array.isArray(order.games)) ? order.games.length : 0} {locale === 'ar' ? 'لعبة' : 'games'}
                        </p>
                      </div>
                    </div>
                  </Col>

                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <Col xs={12} md={6}>
                      <div className="order-detail-item">
                        <div className="order-detail-item__icon">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <div className="order-detail-item__content">
                          <small className="text-muted d-block">
                            {locale === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
                          </small>
                          <p className="fw-semibold mb-0 small">
                            {order.delivery_address}
                          </p>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>

                {/* Custom Message */}
                {order.custom_message && (
                  <div className="order-custom-message mt-3 p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">
                      <FontAwesomeIcon icon={faGamepad} className={locale === 'ar' ? 'ms-1' : 'me-1'} />
                      {locale === 'ar' ? 'رسالة مخصصة' : 'Custom Message'}
                    </small>
                    <p className="mb-0 fst-italic">"{order.custom_message}"</p>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="order-notes mt-2">
                    <small className="text-muted">
                      <strong>{locale === 'ar' ? 'ملاحظات:' : 'Notes:'}</strong> {order.notes}
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
        {locale === 'ar' ? 'حدث خطأ أثناء تحميل الطلبات' : 'Error loading orders'}
        <br />
        <small>{error}</small>
      </Alert>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <FontAwesomeIcon icon={faBox} size="2x" className="mb-3" />
        <p>
          {locale === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}
        </p>
      </Alert>
    )
  }
}

export default OrderList
