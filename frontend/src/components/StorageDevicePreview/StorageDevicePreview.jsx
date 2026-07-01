import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHdd,
  faGamepad,
  faCheckCircle,
  faExclamationTriangle,
  faMicrochip,
  faInfoCircle,
  faTag,
  faRuler,
  faCompactDisc,
  faMemory,
  faSdCard,
  faDatabase
} from '@fortawesome/free-solid-svg-icons'
import './StorageDevicePreview.css'

function getTypeIcon(typeName) {
  if (!typeName) return faDatabase
  const name = typeName.toLowerCase()
  if (name.includes('cd') || name.includes('rom')) return faCompactDisc
  if (name.includes('dvd')) return faCompactDisc
  if (name.includes('usb') || name.includes('flash') || name.includes('stick')) return faMemory
  if (name.includes('hdd') || name.includes('hard')) return faHdd
  if (name.includes('ssd') || name.includes('solid')) return faMicrochip
  if (name.includes('m.2') || name.includes('nvme')) return faSdCard
  return faDatabase
}

function formatSize(mb) {
  if (mb == null) return '-'
  const gb = mb / 1024
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${mb} MB`
}

export default function StorageDevicePreview({ device, selectedItems = [], locale }) {
  if (!device) return null

  const totalCapacity = Number(device.size_gb) || 0
  const usedCapacity = selectedItems.reduce((acc, item) => acc + (Number(item.size_gb) || 0), 0)
  const remainingCapacity = Math.max(0, totalCapacity - usedCapacity)
  const usedPercentage = totalCapacity > 0 ? Math.min((usedCapacity / totalCapacity) * 100, 100) : 0
  const isOverCapacity = usedCapacity > totalCapacity

  const typeName = device.storage_type
    ? (locale === 'ar' ? device.storage_type.name_ar : device.storage_type.name_en)
    : ''
  const typeIcon = getTypeIcon(device.storage_type?.name_en)

  return (
    <div className={`sd-preview-card ${isOverCapacity ? 'over-capacity' : ''}`}>
      <div className="sd-preview-card__header">
        <div className="sd-preview-card__type-icon">
          <FontAwesomeIcon icon={typeIcon} />
        </div>
        <div className="sd-preview-card__header-info">
          <h4 className="sd-preview-card__title">
            {locale === 'ar' ? device.name_ar || device.name_en : device.name_en || device.name_ar}
          </h4>
          {device.marka && (
            <span className="sd-preview-card__brand">
              <FontAwesomeIcon icon={faTag} className="me-1" />
              {device.marka}
            </span>
          )}
        </div>
      </div>

      <div className="sd-preview-card__specs-grid">
        {device.interface && (
          <div className="sd-preview-card__spec">
            <FontAwesomeIcon icon={faMicrochip} className="sd-preview-card__spec-icon" />
            <div className="sd-preview-card__spec-body">
              <span className="sd-preview-card__spec-label">{locale === 'ar' ? 'المنفذ' : 'Interface'}</span>
              <span className="sd-preview-card__spec-value">{device.interface}</span>
            </div>
          </div>
        )}
        {typeName && (
          <div className="sd-preview-card__spec">
            <FontAwesomeIcon icon={faInfoCircle} className="sd-preview-card__spec-icon" />
            <div className="sd-preview-card__spec-body">
              <span className="sd-preview-card__spec-label">{locale === 'ar' ? 'النوع' : 'Type'}</span>
              <span className="sd-preview-card__spec-value">{typeName}</span>
            </div>
          </div>
        )}
        <div className="sd-preview-card__spec">
          <FontAwesomeIcon icon={faRuler} className="sd-preview-card__spec-icon" />
          <div className="sd-preview-card__spec-body">
            <span className="sd-preview-card__spec-label">{locale === 'ar' ? 'السعة المعلنة' : 'Advertised'}</span>
            <span className="sd-preview-card__spec-value">{formatSize(device.size_mb)}</span>
          </div>
        </div>
        {device.real_size_mb != null && (
          <div className="sd-preview-card__spec">
            <FontAwesomeIcon icon={faRuler} className="sd-preview-card__spec-icon" />
            <div className="sd-preview-card__spec-body">
              <span className="sd-preview-card__spec-label">{locale === 'ar' ? 'السعة الفعلية' : 'Actual Size'}</span>
              <span className="sd-preview-card__spec-value">{formatSize(device.real_size_mb)}</span>
            </div>
          </div>
        )}
      </div>

      <p className="sd-preview-card__price">
        {device.price_iqd ? `${Number(device.price_iqd).toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
      </p>

      <div className="sd-storage-meter">
        <div className="sd-storage-meter__header">
          <span>{locale === 'ar' ? 'المساحة المستخدمة' : 'Used Storage'}</span>
          <span className={`sd-storage-meter__percentage ${isOverCapacity ? 'text-danger fw-bold' : ''}`}>
            {usedCapacity.toFixed(1)} / {totalCapacity} GB ({Math.round(usedPercentage)}%)
          </span>
        </div>
        <div className="sd-storage-meter__bar-bg">
          <div
            className={`sd-storage-meter__bar-fill ${isOverCapacity ? 'bg-danger' : 'bg-success'}`}
            style={{ width: `${usedPercentage}%` }}
          ></div>
        </div>
        <div className="sd-storage-meter__footer">
          {isOverCapacity ? (
            <span className="sd-status-alert text-danger">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
              {locale === 'ar' ? `تجاوزت السعة بـ ${(usedCapacity - totalCapacity).toFixed(1)} GB!` : `Over capacity by ${(usedCapacity - totalCapacity).toFixed(1)} GB!`}
            </span>
          ) : (
            <span className="sd-status-alert text-success">
              <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
              {locale === 'ar' ? `متبقي ${remainingCapacity.toFixed(1)} GB متوفرة` : `${remainingCapacity.toFixed(1)} GB remaining`}
            </span>
          )}
        </div>
      </div>

      {(device.description_ar || device.description_en) && (
        <div className="sd-preview-card__description">
          {locale === 'ar' ? device.description_ar || device.description_en : device.description_en || device.description_ar}
        </div>
      )}
    </div>
  )
}
