// Centralized frontend configuration to avoid hardcoded values
export const API_BASE = '/api'

export const PER_PAGE_OPTIONS = [6, 12, 18, 24]

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
}

export const AUTH_CONFIG = {
  minPasswordLength: 8,
}

export default {
  API_BASE,
  PER_PAGE_OPTIONS,
  VIEW_MODES,
  AUTH_CONFIG,
}
