import React, { useEffect, useRef, useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  const handleProfileClick = () => {
    handleNavigate('/profile')
  }

  return (
    <div className={`top-navbar-wrapper d-none d-lg-flex ${hidden ? 'hidden' : 'visible'}`}>
      <Navbar bg="dark" expand="lg" className="top-navbar floating-navbar mb-0">
        <Container className="position-relative">
          <Navbar.Brand href="#" className="text-white fw-bold" onClick={(e) => { e.preventDefault(); handleNavigate('/') }}>
            {t.brand}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link
                className={`text-white ${location.pathname === '/' ? 'active-nav' : ''}`}
                onClick={() => handleNavigate('/')}
                style={{ cursor: 'pointer' }}
              >
                {t.navHome}
              </Nav.Link>
              <Nav.Link
                className={`text-white ${location.pathname.startsWith('/packages') ? 'active-nav' : ''}`}
                onClick={() => handleNavigate('/packages')}
                style={{ cursor: 'pointer' }}
              >
                {t.navPackages}
              </Nav.Link>
              <Nav.Link
                className={`text-white ${location.pathname === '/support' ? 'active-nav' : ''}`}
                onClick={() => handleNavigate('/support')}
                style={{ cursor: 'pointer' }}
              >
                {t.navFeatures}
              </Nav.Link>
              <Nav.Link
                className={`text-white nav-design-action ${location.pathname === '/design' ? 'active-nav' : ''}`}
                onClick={() => handleNavigate('/design')}
                style={{ cursor: 'pointer' }}
              >
                {t.navDesignUSB}
              </Nav.Link>

              {/* Auth area */}
              <div className="d-flex align-items-center gap-2">
                {user ? (
                  <>
                    <Nav.Link
                      className={`text-white d-flex align-items-center gap-2 ${location.pathname === '/profile' ? 'active-nav' : ''}`}
                      onClick={handleProfileClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      {user.name}
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link className="text-white" onClick={onShowAuth} style={{ cursor: 'pointer' }}>
                    {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Nav.Link>
                )}
              </div>

              {/* Modern Theme & Language Switcher Widget */}
              <div className="d-flex align-items-center gap-3 ms-lg-3 px-2.5 py-1.5 rounded-pill bg-navbar-widget border-navbar-widget">
                {/* Language Switcher (Pill style) */}
                <div className="locale-toggle-pill" onClick={onToggleLocale} title={locale === 'ar' ? 'Change to English' : 'تغيير إلى العربية'}>
                  <span className={`locale-toggle-pill__item ${locale === 'en' ? 'active' : ''}`}>EN</span>
                  <span className={`locale-toggle-pill__item ${locale === 'ar' ? 'active' : ''}`}>AR</span>
                </div>

                {/* Vertical Divider */}
                <div className="widget-divider"></div>

                {/* Theme Switcher Button */}
                <button
                  type="button"
                  className="theme-toggle-icon-btn"
                  onClick={onToggleTheme}
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  title={theme === 'light' ? (locale === 'ar' ? 'الوضع الداكن' : 'Dark Mode') : (locale === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}
                >
                  <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="theme-icon" />
                </button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default TopNavbar
