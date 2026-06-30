import { useAdminTheme } from '../../contexts/AdminThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

function AdminDarkModeToggle() {
  const { isDark, toggleDarkMode } = useAdminTheme()

  return (
    <button
      className="admin-sidebar__link admin-darkmode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="admin-sidebar__link-icon" />
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      <span className="admin-darkmode-toggle__switch">
        <span className={`admin-darkmode-toggle__thumb ${isDark ? 'admin-darkmode-toggle__thumb--dark' : ''}`} />
      </span>
    </button>
  )
}

export default AdminDarkModeToggle
