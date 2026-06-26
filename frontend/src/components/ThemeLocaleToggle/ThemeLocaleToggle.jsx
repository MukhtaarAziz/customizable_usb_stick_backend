import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import './ThemeLocaleToggle.css'

function ThemeLocaleToggle({ theme, onToggleTheme }) {
  return (
    <Button
      variant="outline-light"
      className="theme-toggle-btn"
      onClick={onToggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
    </Button>
  )
}

export default ThemeLocaleToggle
