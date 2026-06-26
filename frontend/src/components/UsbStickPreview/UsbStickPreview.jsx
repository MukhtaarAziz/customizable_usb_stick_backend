import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHdd, 
  faGamepad, 
  faCheckCircle, 
  faExclamationTriangle,
  faClock,
  faMicrochip,
  faBolt,
  faInfoCircle,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons'
import './UsbStickPreview.css'

export default function UsbStickPreview({ usb, selectedItems = [], locale }) {
  if (!usb) return null

  const totalCapacity = Number(usb.size_gb) || 0
  const usedCapacity = selectedItems.reduce((acc, item) => acc + (Number(item.size_gb) || 0), 0)
  const remainingCapacity = Math.max(0, totalCapacity - usedCapacity)
  const usedPercentage = totalCapacity > 0 ? Math.min((usedCapacity / totalCapacity) * 100, 100) : 0
  const isOverCapacity = usedCapacity > totalCapacity

  const formatSize = (size) => Number(size).toFixed(1)

  // Dynamically calculate speed based on USB interface
  const getSpeedDetails = (iface) => {
    switch (String(iface).trim()) {
      case '3.2':
        return {
          readSpeed: 300,
          writeSpeed: 150,
          label: locale === 'ar' ? 'USB 3.2 Gen 1 (سرعة فائقة)' : 'USB 3.2 Gen 1 (SuperSpeed)',
          readPercent: 95,
          writePercent: 85
        }
      case '3.1':
        return {
          readSpeed: 150,
          writeSpeed: 80,
          label: locale === 'ar' ? 'USB 3.1 Gen 1 (سرعة فائقة)' : 'USB 3.1 Gen 1 (SuperSpeed)',
          readPercent: 75,
          writePercent: 60
        }
      case '3.0':
        return {
          readSpeed: 100,
          writeSpeed: 45,
          label: locale === 'ar' ? 'USB 3.0 (سرعة عالية جداً)' : 'USB 3.0 (SuperSpeed)',
          readPercent: 60,
          writePercent: 45
        }
      case '2.0':
      default:
        return {
          readSpeed: 25,
          writeSpeed: 10,
          label: locale === 'ar' ? 'USB 2.0 (سرعة عادية)' : 'USB 2.0 (High Speed)',
          readPercent: 30,
          writePercent: 20
        }
    }
  }

  const speed = getSpeedDetails(usb.interface)

  // Formats estimated transfer time
  const formatEstimatedTime = (gb, writeSpeedMb) => {
    if (!gb || gb <= 0) return '-'
    const totalMb = gb * 1024
    const totalSeconds = Math.round(totalMb / writeSpeedMb)
    
    if (totalSeconds < 60) {
      return locale === 'ar' ? `${totalSeconds} ثانية` : `${totalSeconds} sec`
    }
    
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    if (seconds === 0) {
      return locale === 'ar' ? `${minutes} دقيقة` : `${minutes} min`
    }
    
    return locale === 'ar' 
      ? `${minutes} د و ${seconds} ث` 
      : `${minutes} min ${seconds} sec`
  }

  const estTime = formatEstimatedTime(usedCapacity, speed.writeSpeed)

  return (
    <div className={`usb-preview-card ${isOverCapacity ? 'over-capacity' : ''}`}>
      <div className="usb-preview-card__visual">
        {/* Dynamic USB Stick Visualizer */}
        <div className="usb-stick-model">
          {/* Metal Connector */}
          <div className="usb-stick-model__connector">
            <div className="usb-stick-model__connector-pins"></div>
          </div>
          
          {/* Main Body */}
          <div className="usb-stick-model__body">
            {/* Liquid/Fluid dynamic progress filler */}
            <div 
              className={`usb-stick-model__fill ${isOverCapacity ? 'fill-danger' : ''}`}
              style={{ height: `${usedPercentage}%` }}
            ></div>
            
            {/* Reflection Shine overlay */}
            <div className="usb-stick-model__shine"></div>
            
            {/* LED Status Light */}
            <div className={`usb-stick-model__led ${selectedItems.length > 0 ? 'active' : ''} ${isOverCapacity ? 'danger' : ''}`}></div>
            
            {/* Text Overlay on USB Stick */}
            <div className="usb-stick-model__label">
              <span className="usb-stick-model__size">{totalCapacity}GB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="usb-preview-card__details">
        <h4 className="usb-preview-card__title">
          {locale === 'ar' ? usb.name_ar || usb.name_en : usb.name_en || usb.name_ar}
        </h4>
        <p className="usb-preview-card__price">
          {usb.price_iqd ? `${usb.price_iqd.toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
        </p>

        <div className="usb-preview-card__stats">
          <div className="usb-preview-card__stat-item">
            <div className="usb-preview-card__stat-icon">
              <FontAwesomeIcon icon={faHdd} />
            </div>
            <div className="usb-preview-card__stat-info">
              <span className="stat-label">{locale === 'ar' ? 'السعة الكلية' : 'Total Size'}</span>
              <span className="stat-value">{totalCapacity} GB</span>
            </div>
          </div>

          <div className="usb-preview-card__stat-item">
            <div className="usb-preview-card__stat-icon">
              <FontAwesomeIcon icon={faGamepad} />
            </div>
            <div className="usb-preview-card__stat-info">
              <span className="stat-label">{locale === 'ar' ? 'العناصر المضافة' : 'Items Added'}</span>
              <span className="stat-value">{selectedItems.length}</span>
            </div>
          </div>
        </div>

        {/* Live Storage Progress Bar */}
        <div className="usb-storage-meter">
          <div className="usb-storage-meter__header">
            <span>{locale === 'ar' ? 'المساحة المستخدمة' : 'Used Storage'}</span>
            <span className={`usb-storage-meter__percentage ${isOverCapacity ? 'text-danger fw-bold' : ''}`}>
              {formatSize(usedCapacity)} / {totalCapacity} GB ({Math.round(usedPercentage)}%)
            </span>
          </div>
          
          <div className="usb-storage-meter__bar-bg">
            <div 
              className={`usb-storage-meter__bar-fill ${isOverCapacity ? 'bg-danger' : 'bg-success'}`}
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>

          <div className="usb-storage-meter__footer">
            {isOverCapacity ? (
              <span className="usb-status-alert text-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                {locale === 'ar' 
                  ? `تجاوزت السعة بـ ${formatSize(usedCapacity - totalCapacity)} GB!` 
                  : `Over capacity by ${formatSize(usedCapacity - totalCapacity)} GB!`}
              </span>
            ) : (
              <span className="usb-status-alert text-success">
                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                {locale === 'ar' 
                  ? `متبقي ${formatSize(remainingCapacity)} GB متوفرة` 
                  : `${formatSize(remainingCapacity)} GB remaining`}
              </span>
            )}
          </div>
        </div>

        {/* Technical Specifications Panel */}
        <div className="usb-specs-panel mt-4">
          <div className="usb-specs-panel__title mb-2">
            <FontAwesomeIcon icon={faInfoCircle} className={locale === 'ar' ? 'ms-2' : 'me-2'} />
            {locale === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
          </div>

          <div className="usb-specs-grid">
            <div className="usb-spec-card">
              <div className="usb-spec-card__header">
                <FontAwesomeIcon icon={faMicrochip} className="usb-spec-card__icon text-primary me-1" />
                <span className="usb-spec-card__label">{locale === 'ar' ? 'نوع المنفذ' : 'Interface Port'}</span>
              </div>
              <div className="usb-spec-card__value">{speed.label}</div>
            </div>

            {usedCapacity > 0 && (
              <div className="usb-spec-card mt-2">
                <div className="usb-spec-card__header">
                  <FontAwesomeIcon icon={faClock} className="usb-spec-card__icon text-warning me-1" />
                  <span className="usb-spec-card__label">{locale === 'ar' ? 'وقت النسخ المقدر' : 'Estimated Copy Time'}</span>
                </div>
                <div className="usb-spec-card__value text-warning fw-bold">{estTime}</div>
              </div>
            )}
          </div>

          {/* Speed Visual Indicators */}
          <div className="usb-speed-meters mt-3">
            <div className="usb-speed-meter">
              <div className="usb-speed-meter__labels d-flex justify-content-between text-muted small">
                <span>
                  <FontAwesomeIcon icon={faBolt} className="text-success me-1" />
                  {locale === 'ar' ? 'سرعة القراءة' : 'Read Speed'}
                </span>
                <span className="fw-bold">{speed.readSpeed} MB/s</span>
              </div>
              <div className="usb-speed-meter__progress">
                <div 
                  className="usb-speed-meter__fill bg-success"
                  style={{ width: `${speed.readPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="usb-speed-meter mt-2">
              <div className="usb-speed-meter__labels d-flex justify-content-between text-muted small">
                <span>
                  <FontAwesomeIcon icon={faExchangeAlt} className="text-info me-1" />
                  {locale === 'ar' ? 'سرعة الكتابة' : 'Write Speed'}
                </span>
                <span className="fw-bold">{speed.writeSpeed} MB/s</span>
              </div>
              <div className="usb-speed-meter__progress">
                <div 
                  className="usb-speed-meter__fill bg-info"
                  style={{ width: `${speed.writePercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Description */}
          {(usb.description_ar || usb.description_en) && (
            <div className="usb-specs-description mt-3">
              <div className="usb-specs-description__text text-muted small">
                {locale === 'ar' 
                  ? usb.description_ar || usb.description_en 
                  : usb.description_en || usb.description_ar}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
