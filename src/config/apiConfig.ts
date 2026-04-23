/**
 * Centralized API configuration to handle both local development and Vercel production.
 */

// In production on Vercel, the frontend and backend are on the same domain.
// We should use relative paths (/api/...) instead of a full URL to avoid CORS and loopback issues.
const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  const isProd = (import.meta as any).env?.PROD;

  // If we have an environment variable...
  if (envUrl) {
    // ...but we are in production and it's pointing to localhost, ignore it.
    if (isProd && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return '';
    }
    return envUrl;
  }

  // Fallback: in production, default to relative paths.
  // In development, if VITE_API_URL is missing, we might need a default like http://localhost:3002.
  return isProd ? '' : 'http://localhost:3002';
};

export const API_URL = getApiUrl();
export const ADMIN_API = `${API_URL}/api/admin`;
export const SUPERADMIN_API = `${API_URL}/api/superadmin`;
export const COACH_API = `${API_URL}/api/coach`;
