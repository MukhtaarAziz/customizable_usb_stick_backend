import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faMicrochip,
  faHdd,
  faCompactDisc,
  faMemory,
  faSdCard,
  faDatabase,
  faTag,
  faRuler,
  faInfoCircle,
  faCircle
} from '@fortawesome/free-solid-svg-icons'
import './StorageSelectionGrid.css'

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

function getTypeColor(typeName) {
  if (!typeName) return '#64748b'
  const name = typeName.toLowerCase()
  if (name.includes('cd') || name.includes('rom')) return '#f59e0b'
  if (name.includes('dvd')) return '#8b5cf6'
  if (name.includes('usb') || name.includes('flash') || name.includes('stick')) return '#3b82f6'
  if (name.includes('hdd') || name.includes('hard')) return '#ef4444'
  if (name.includes('ssd') || name.includes('solid')) return '#10b981'
  if (name.includes('m.2') || name.includes('nvme')) return '#06b6d4'
  return '#64748b'
}

function formatSize(mb) {
  if (mb == null) return '-'
  const gb = mb / 1024
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${mb} MB`
}

function StorageSelectionGrid({ devices, selectedDeviceId, onSelect, locale }) {
  return (
    <div className="sd-selection-grid">
      {devices.map((device) => {
        const isSelected = String(device.id) === String(selectedDeviceId)
        const name = locale === 'ar' ? device.name_ar || device.name_en : device.name_en || device.name_ar
        const typeName = device.storage_type
          ? (locale === 'ar' ? device.storage_type.name_ar : device.storage_type.name_en)
          : ''
        const typeIcon = getTypeIcon(device.storage_type?.name_en)
        const typeColor = getTypeColor(device.storage_type?.name_en)
        const gb = device.size_mb ? (device.size_mb / 1024).toFixed(1) : '0'
        const realGb = device.real_size_mb ? (device.real_size_mb / 1024).toFixed(1) : null

        return (
          <div
            key={device.id}
            className={`sd-selection-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(device.id)}
          >
            <div className="sd-selection-card__icon-wrap" style={{ background: typeColor }}>
              <FontAwesomeIcon icon={typeIcon} className="sd-selection-card__svg" />
            </div>

            <div className="sd-selection-card__details-block">
              <div className="sd-selection-card__name-capacity">
                <div className="sd-selection-card__name">{name}</div>
                <span className="sd-selection-card__capacity">{gb} GB</span>
              </div>

              <div className="sd-selection-card__meta-badges">
                {device.storage_type && (
                  <span className="sd-selection-card__type-badge" style={{ borderColor: typeColor, color: typeColor }}>
                    <FontAwesomeIcon icon={faCircle} style={{ color: typeColor, fontSize: '0.45rem' }} className="me-1" />
                    {typeName}
                  </span>
                )}
                {device.interface && (
                  <span className="sd-selection-card__chip-badge">
                    <FontAwesomeIcon icon={faMicrochip} className="me-1" />
                    {device.interface}
                  </span>
                )}
                {device.marka && (
                  <span className="sd-selection-card__chip-badge">
                    <FontAwesomeIcon icon={faTag} className="me-1" />
                    {device.marka}
                  </span>
                )}
              </div>

              <div className="sd-selection-card__specs-row">
                {device.size_mb != null && (
                  <div className="sd-selection-card__spec">
                    <FontAwesomeIcon icon={faRuler} className="sd-selection-card__spec-icon" />
                    <div className="sd-selection-card__spec-text">
                      <span className="sd-selection-card__spec-label">
                        {locale === 'ar' ? 'السعة المعلنة' : 'Advertised'}
                      </span>
                      <span className="sd-selection-card__spec-value">{formatSize(device.size_mb)}</span>
                    </div>
                  </div>
                )}
                {realGb && (
                  <div className="sd-selection-card__spec">
                    <FontAwesomeIcon icon={faInfoCircle} className="sd-selection-card__spec-icon" />
                    <div className="sd-selection-card__spec-text">
                      <span className="sd-selection-card__spec-label">
                        {locale === 'ar' ? 'السعة الفعلية' : 'Actual Size'}
                      </span>
                      <span className="sd-selection-card__spec-value">{realGb} GB</span>
                    </div>
                  </div>
                )}
              </div>

              {(device.description_en || device.description_ar) && (
                <div className="sd-selection-card__description">
                  {locale === 'ar' ? device.description_ar || device.description_en : device.description_en || device.description_ar}
                </div>
              )}

              <div className="sd-selection-card__price-tag">
                <span className="text-muted small fw-semibold">
                  {locale === 'ar' ? 'السعر' : 'Price'}
                </span>
                <span className="sd-selection-card__price-value">
                  {device.price_iqd ? `${Number(device.price_iqd).toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
                </span>
              </div>
            </div>

            {isSelected && (
              <div className="sd-selection-card__badge">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StorageSelectionGrid
