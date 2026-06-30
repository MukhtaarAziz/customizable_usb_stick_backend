import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AdminThemeContext = createContext(null)

function getInitialDark() {
  try {
    const raw = localStorage.getItem('adminSettings')
    if (raw) return JSON.parse(raw).darkmode ?? false
  } catch {}
  return false
}

function persistDark(isDark) {
  try {
    const raw = localStorage.getItem('adminSettings')
    const s = raw ? JSON.parse(raw) : {}
    s.darkmode = isDark
    localStorage.setItem('adminSettings', JSON.stringify(s))
  } catch {}
}

export function AdminThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialDark)

  const applyTheme = useCallback((dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    document.body.classList.toggle('theme-dark', dark)
    document.body.classList.toggle('theme-light', !dark)
  }, [])

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark, applyTheme])

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      persistDark(next)
      return next
    })
  }, [])

  const setDarkMode = useCallback((dark) => {
    setIsDark(dark)
    persistDark(dark)
  }, [])

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleDarkMode, setDarkMode }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider')
  return ctx
}
