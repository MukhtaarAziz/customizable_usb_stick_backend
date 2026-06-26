import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import './ThemeToggle.css'

function ThemeToggle({ theme, onToggleTheme }) {
  return (
    <Button
      variant="outline-secondary"
      className="theme-toggle-btn"
      onClick={onToggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
    </Button>
  )
}

export default ThemeToggle
