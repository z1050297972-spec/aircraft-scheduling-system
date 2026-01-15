/**
 * Application configuration constants
 */

// Navigation routes
export const ROUTES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  GENERATOR: 'generator',
  LIBRARY: 'library',
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  GENERATE_TEST_CASE: '/generate',
  OPTIMIZE_DESCRIPTION: '/optimize',
} as const;

// UI constants
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  MAX_INPUT_LENGTH: 1000,
  TOAST_DURATION: 3000,
} as const;
