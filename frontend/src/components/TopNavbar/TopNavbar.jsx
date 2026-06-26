import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import './TopNavbar.css'

function TopNavbar({
  t,
  theme,
  onToggleTheme,
  onToggleLocale,
  user,
  onShowAuth,
  locale,
  onNavigate
}) {
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset
      if (currentY <= 0) {
        setHidden(false)
        lastY.current = 0
        return
      }
      if (currentY > lastY.current && currentY > 120) {
        setHidden(true)
      } else if (currentY < lastY.current) {
        setHidden(false)
      }
      lastY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isRtl = locale === 'ar'

  const navItems = [
    { path: '/', label: t.navHome },
    { path: '/packages', label: t.navPackages },
    { path: '/support', label: t.navFeatures },
  ]

  return (
    <nav className={`top-navbar d-none d-lg-flex ${hidden ? 'top-navbar--hidden' : 'top-navbar--visible'}`}>
      <div className="top-navbar__inner">
        <a
          href="/"
          className="top-navbar__brand"
          onClick={(e) => { e.preventDefault(); onNavigate('/') }}
        >
          {t.brand}
        </a>

        <div className="top-navbar__links">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`top-navbar__link ${location.pathname === item.path ? 'top-navbar__link--active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            className={`top-navbar__link top-navbar__link--design ${location.pathname === '/design' ? 'top-navbar__link--active' : ''}`}
            onClick={() => onNavigate('/design')}
          >
            {t.navDesignUSB}
          </button>
        </div>

        <div className="top-navbar__actions">
          {user ? (
            <button
              type="button"
              className={`top-navbar__link top-navbar__link--profile ${location.pathname === '/profile' ? 'top-navbar__link--active' : ''}`}
              onClick={() => onNavigate('/profile')}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              className="top-navbar__link top-navbar__link--login"
              onClick={onShowAuth}
            >
              {isRtl ? 'تسجيل الدخول' : 'Login'}
            </button>
          )}

          <div className="top-navbar__widget">
            <div className="top-navbar__lang-pill" onClick={onToggleLocale}>
              <span className={`top-navbar__lang-item ${locale === 'en' ? 'top-navbar__lang-item--active' : ''}`}>EN</span>
              <span className={`top-navbar__lang-item ${locale === 'ar' ? 'top-navbar__lang-item--active' : ''}`}>AR</span>
            </div>

            <div className="top-navbar__divider" />

            <button
              type="button"
              className="top-navbar__theme-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar
