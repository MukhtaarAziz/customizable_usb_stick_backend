// Centralized frontend configuration to avoid hardcoded values
// Prefer an explicit backend base URL from environment (Vite):
// - When developing with Vite proxy, leave unset and use '/api'.
// - In other environments set VITE_API_BASE_URL (e.g. http://localhost:8000)
const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
export const API_BASE = ENV_API_BASE ? `${ENV_API_BASE.replace(/\/$/, '')}/api` : '/api'

export const PER_PAGE_OPTIONS = [6, 12, 18, 24]

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
}

export const AUTH_CONFIG = {
  minPasswordLength: 8,
}

export const CATALOG_TYPES = {
  ALL: 'all',
  GAME: 'game',
  PROGRAM: 'program',
}

export default {
  API_BASE,
  PER_PAGE_OPTIONS,
  VIEW_MODES,
  AUTH_CONFIG,
  CATALOG_TYPES,
}
