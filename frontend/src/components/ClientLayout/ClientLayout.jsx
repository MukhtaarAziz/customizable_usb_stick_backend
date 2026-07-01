import { Outlet, useLocation } from 'react-router-dom'
import TopNavbar from '../TopNavbar/TopNavbar.jsx'
import MobileTopBar from '../MobileTopBar/MobileTopBar.jsx'
import MobileBottomNav from '../MobileBottomNav/MobileBottomNav.jsx'
import AuthModal from '../AuthModals/AuthModal.jsx'

function ClientLayout({
  t, theme, locale, user,
  onToggleTheme, onToggleLocale, onLogout, onNavigate,
  showAuth, onShowAuth, onCloseAuth, onAuth,
  handleProfileClick,
}) {
  const location = useLocation()

  return (
    <>
      <TopNavbar
        t={t}
        theme={theme}
        locale={locale}
        user={user}
        onToggleTheme={onToggleTheme}
        onToggleLocale={onToggleLocale}
        onShowAuth={onShowAuth}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <MobileTopBar
        theme={theme}
        locale={locale}
        onToggleTheme={onToggleTheme}
        onToggleLocale={onToggleLocale}
      />

      <Outlet />

      {!showAuth && location.pathname !== '/design' && (
        <MobileBottomNav
          locale={locale}
          onProfileClick={handleProfileClick}
        />
      )}

      <AuthModal show={showAuth} onClose={onCloseAuth} onAuth={onAuth} locale={locale} />
    </>
  )
}

export default ClientLayout