import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBox, faUser, faGamepad, faHeadset } from '@fortawesome/free-solid-svg-icons'
import './MobileBottomNav.css'

function MobileBottomNav({ locale, onProfileClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: faHome, label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/packages', icon: faBox, label: locale === 'ar' ? 'الباقات' : 'Packages' },
    { path: '/design', icon: faGamepad, label: locale === 'ar' ? 'تصميم' : 'Design', isCenter: true },
    { key: 'profile', icon: faUser, label: locale === 'ar' ? 'حسابي' : 'Profile', isProfile: true },
    { path: '/support', icon: faHeadset, label: locale === 'ar' ? 'الدعم' : 'Support' }
  ]

  const handleItemClick = (item) => {
    if (item.isProfile) {
      onProfileClick?.()
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav__inner">
        {navItems.map((item) => {
          const isCenter = item.isCenter
          const isActive = item.isProfile
            ? location.pathname === '/profile'
            : location.pathname === item.path
          return (
            <button
              key={item.key || item.path}
              onClick={() => handleItemClick(item)}
              className={`
                mbn-item
                ${isCenter ? 'mbn-item--center' : ''}
                ${isActive ? 'mbn-item--active' : ''}
              `}
            >
              <span className={`mbn-icon ${isCenter ? 'mbn-icon--center' : ''}`}>
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className={`mbn-text ${isCenter ? 'mbn-text--center' : ''}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav