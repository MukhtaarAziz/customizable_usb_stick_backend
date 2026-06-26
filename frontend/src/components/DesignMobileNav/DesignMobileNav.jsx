import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './DesignMobileNav.css'

export default function DesignMobileNav({
  locale,
  activeStep,
  onShowUsbModal,
  onExit,
  selectedUsb,
}) {
  const isRtl = locale === 'ar'

  // Show USB button only from step 2 onwards and when USB is selected
  const showUsbBtn = activeStep >= 2 && selectedUsb

  return (
    <nav className="design-mobile-nav d-md-none">
      {/* Exit / Back Button */}
      <button
        type="button"
        className="design-mobile-nav__exit"
        onClick={onExit}
        aria-label={isRtl ? 'خروج من التصميم' : 'Exit design'}
      >
        <FontAwesomeIcon icon={isRtl ? faArrowRight : faArrowLeft} className="design-mobile-nav__exit-icon" />
        <span className="design-mobile-nav__exit-label">
          {isRtl ? 'خروج' : 'Exit'}
        </span>
      </button>

      {/* USB Details Button - visible from step 2+ */}
      {showUsbBtn && (
        <button
          type="button"
          className="design-mobile-nav__usb-btn"
          onClick={onShowUsbModal}
          aria-label={isRtl ? 'تفاصيل الفلاش' : 'USB Details'}
        >
          <svg className="design-mobile-nav__usb-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V7" />
            <rect x="6" y="7" width="12" height="14" rx="2.5" />
            <circle cx="12" cy="17" r="1.2" fill="currentColor" />
            <line x1="9" y1="11" x2="15" y2="11" strokeWidth="1.5" opacity="0.6" />
          </svg>
          <span className="design-mobile-nav__usb-label">
            {isRtl ? 'عرض الفلاش' : 'View USB'}
          </span>
        </button>
      )}

      {/* Step indicator - shown when USB button is hidden */}
      {!showUsbBtn && (
        <div className="design-mobile-nav__step-info">
          <span className="design-mobile-nav__step-num">
            {isRtl ? 'اختر الفلاش أولاً' : 'Select USB first'}
          </span>
        </div>
      )}
    </nav>
  )
}