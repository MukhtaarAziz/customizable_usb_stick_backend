import { Button } from 'react-bootstrap'
import './LocaleToggle.css'

function LocaleToggle({ locale, onToggleLocale }) {
  return (
    <Button
      variant="outline-secondary"
      className="locale-toggle-btn"
      onClick={onToggleLocale}
      aria-label="Toggle language"
    >
      {locale === 'en' ? 'EN' : 'ع'}
    </Button>
  )
}

export default LocaleToggle
