import React from 'react'
import { Modal, Button, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane, faTimes, faExclamationTriangle, faGamepad, faCode } from '@fortawesome/free-solid-svg-icons'
import UsbStickPreview from '../UsbStickPreview/UsbStickPreview.jsx'
import './UsbDetailsModal.css'

export default function UsbDetailsModal({ show, onHide, usb, selectedItems, locale, onRemoveItem, onCheckout }) {
  if (!usb) return null

  const totalCapacity = Number(usb.size_gb) || 0
  const usedCapacity = selectedItems.reduce((acc, item) => acc + (Number(item.size_gb) || 0), 0)
  const isOverCapacity = usedCapacity > totalCapacity

  const handleCheckoutClick = () => {
    onHide()
    onCheckout()
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="usb-details-modal"
      contentClassName="usb-details-modal__content"
      backdropClassName="usb-details-modal__backdrop"
      style={{ zIndex: 1200 }}
    >
      <Modal.Header className="border-0 pb-0 justify-content-between align-items-center">
        <Modal.Title className="fw-bold fs-5">
          {locale === 'ar' ? 'تفاصيل وحالة الفلاش ميموري' : 'USB Flash Status & Details'}
        </Modal.Title>
        <button type="button" className="usb-details-modal__close-btn" onClick={onHide} aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <div className="row g-4">
          {/* Left Column - USB Stick Visualizer & Specs */}
          <div className="col-12 col-md-6">
            <UsbStickPreview
              usb={usb}
              selectedItems={selectedItems}
              locale={locale}
            />
          </div>

          {/* Right Column - Selected Items list & Checkout details */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <div className="usb-details-modal__games-card flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  {locale === 'ar' ? 'قائمة العناصر المختارة' : 'Selected Items List'}
                </h6>
                <span className="badge bg-primary rounded-pill">{selectedItems.length}</span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-center py-5 text-muted small">
                  {locale === 'ar' ? 'لم تقم بإضافة أي عناصر بعد.' : 'No items added yet.'}
                </div>
              ) : (
                <div className="usb-details-modal__sidebar-list mb-3">
                  {selectedItems.map((item) => {
                    const isGame = item.type === 'game'
                    return (
                      <div key={`${item.type}-${item.id}`} className="usb-details-modal__sidebar-item">
                        <div className="usb-details-modal__sidebar-item-name d-flex align-items-center gap-2">
                          <Badge bg={isGame ? 'primary' : 'indigo'} className="py-0 px-1" style={isGame ? {} : { background: '#6366f1' }}>
                            <FontAwesomeIcon icon={isGame ? faGamepad : faCode} className="me-1" />
                            {isGame ? (locale === 'ar' ? 'لعبة' : 'Game') : (locale === 'ar' ? 'برنامج' : 'App')}
                          </Badge>
                          {locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="usb-details-modal__sidebar-item-size text-muted small">
                            {item.size_gb ? `${Number(item.size_gb).toFixed(1)} GB` : '0 GB'}
                          </span>
                          <button
                            type="button"
                            className="usb-details-modal__sidebar-item-remove"
                            onClick={() => onRemoveItem(item.id, item.type)}
                            title={locale === 'ar' ? 'إزالة' : 'Remove'}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {isOverCapacity && (
                <Alert variant="danger" className="py-2 px-3 small mb-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {locale === 'ar'
                    ? 'لقد تجاوزت المساحة المتاحة بالفلاش! يرجى إزالة بعض العناصر.'
                    : 'Storage limit exceeded! Please remove some items.'}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="success"
          className="px-4 py-2 wizard-btn-next wizard-btn-next--success"
          disabled={selectedItems.length === 0 || isOverCapacity}
          onClick={handleCheckoutClick}
        >
          <FontAwesomeIcon icon={faPaperPlane} className={locale === 'ar' ? 'ms-2' : 'me-2'} />
          <span className="wizard-btn-text">
            {locale === 'ar' ? 'التالي: معلومات الشحن' : 'Next: Shipping Info'}
          </span>
        </Button>
        <Button variant="outline-secondary" className="px-4 py-2" onClick={onHide}>
          {locale === 'ar' ? 'إغلاق' : 'Close'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
