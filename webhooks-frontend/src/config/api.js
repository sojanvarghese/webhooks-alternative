// API configuration for different environments
// This handles the backend API URL based on the current environment

/**
 * Get the backend API base URL based on the current environment
 * In development: uses localhost:3001
 * In production: uses the same domain with port 3001 or relative paths
 */
export const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  // In production, try to use the same domain but with port 3001
  // This works for NeetoDeploy where both frontend and backend run on the same instance
  const currentOrigin = window.location.origin;

  // If we're on NeetoDeploy, the backend should be accessible on the same domain
  // but different port or path
  if (currentOrigin.includes("neetodeployapp.com")) {
    // For NeetoDeploy, assume backend is on the same domain but different port
    return currentOrigin.replace(":3000", ":3001");
  }

  // Fallback: assume backend is on the same origin
  return currentOrigin;
};

/**
 * Create a full API URL for a given endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/some-uuid')
 * @returns {string} - The full API URL
 */
export const createApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * API client configuration
 */
export const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

const apiUtils = {
  getApiBaseUrl,
  createApiUrl,
  apiConfig,
};

export default apiUtils;
