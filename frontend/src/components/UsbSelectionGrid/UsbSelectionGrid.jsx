import { useState } from 'react'
import { Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import './UsbSelectionGrid.css'

function UsbSelectionGrid({ usbSticks, selectedUsbId, onSelect, locale }) {
  return (
    <div className="usb-selection-grid">
      {usbSticks.map((usb) => {
        const isSelected = String(usb.id) === String(selectedUsbId)
        const name = locale === 'ar' ? usb.name_ar || usb.name_en : usb.name_en || usb.name_ar
        
        return (
          <div
            key={usb.id}
            className={`usb-selection-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(usb.id)}
          >
            <div className="usb-selection-card__icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="usb-selection-card__svg">
                <path d="M9 7V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V7" />
                <rect x="6" y="7" width="12" height="14" rx="2.5" />
                <circle cx="12" cy="17" r="1.2" fill="currentColor" />
                <line x1="9" y1="11" x2="15" y2="11" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>
            
            <div className="usb-selection-card__details-block">
              <div className="usb-selection-card__name-capacity">
                <div className="usb-selection-card__name">{name}</div>
                <span className="usb-selection-card__capacity">{usb.size_gb} GB</span>
              </div>

              <div className="usb-selection-card__meta">
                {usb.interface && (
                  <span className="usb-selection-card__interface-badge">
                    <FontAwesomeIcon icon={faMicrochip} className={locale === 'ar' ? 'ms-1' : 'me-1'} style={{ fontSize: '0.65rem' }} />
                    USB {usb.interface}
                  </span>
                )}
              </div>

              {(usb.description_en || usb.description_ar) && (
                <div className="usb-selection-card__description">
                  {locale === 'ar' ? usb.description_ar || usb.description_en : usb.description_en || usb.description_ar}
                </div>
              )}
              
              <div className="usb-selection-card__price-tag">
                <span className="text-muted small">{locale === 'ar' ? 'السعر' : 'Price'}</span>
                <span className="usb-selection-card__price-value">
                  {usb.price_iqd ? `${usb.price_iqd.toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
                </span>
              </div>
            </div>

            {isSelected && (
              <div className="usb-selection-card__badge">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default UsbSelectionGrid