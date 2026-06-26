import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx'
import LocaleToggle from '../LocaleToggle/LocaleToggle.jsx'
import './MobileTopBar.css'

export default function MobileTopBar({ theme, locale, onToggleTheme, onToggleLocale }) {
  return (
    <div className="mobile-top-bar d-lg-none">
      <div className="mobile-top-bar__controls">
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        <LocaleToggle locale={locale} onToggleLocale={onToggleLocale} />
      </div>
    </div>
  )
}
