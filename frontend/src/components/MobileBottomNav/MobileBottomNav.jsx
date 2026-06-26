import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBox, faUser, faGamepad, faHeadset } from '@fortawesome/free-solid-svg-icons'
import './MobileBottomNav.css'

function MobileBottomNav({ locale }) {
  const navItems = [
    { path: '/', icon: faHome, label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/packages', icon: faBox, label: locale === 'ar' ? 'الباقات' : 'Packages' },
    { path: '/design', icon: faGamepad, label: locale === 'ar' ? 'تصميم' : 'Design', isCenter: true },
    { path: '/profile', icon: faUser, label: locale === 'ar' ? 'حسابي' : 'Profile' },
    { path: '/support', icon: faHeadset, label: locale === 'ar' ? 'الدعم' : 'Support' }
  ]

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav__inner">
        {navItems.map((item) => {
          const isCenter = item.isCenter
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `mbn-item ${isCenter ? 'mbn-item--center' : ''} ${isActive ? 'mbn-item--active' : ''}`
              }
            >
              <span className={`mbn-icon ${isCenter ? 'mbn-icon--center' : ''}`}>
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className={`mbn-text ${isCenter ? 'mbn-text--center' : ''}`}>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav