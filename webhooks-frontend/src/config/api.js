// API configuration for different environments
// This handles the backend API URL based on the current environment

/**
 * Get the backend API base URL based on the current environment
 * In development: uses localhost:3001
 * In production: uses the same domain but with port 3001 for NeetoDeploy
 */
export const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  // In production, check if we're on NeetoDeploy
  const origin = window.location.origin;
  if (origin.includes('neetodeployapp.com')) {
    // NeetoDeploy: Backend runs on port 3001, frontend typically on port 3000 or no port
    // Remove any existing port and add :3001
    const baseUrl = origin.replace(/:\d+$/, '');
    return `${baseUrl}:3001`;
  }

  // For other production environments, use the same origin
  return origin;
};

/**
 * Get the webhook endpoint base URL
 * This is where external services should send webhook requests
 * In development: uses localhost:3001
 * In production: uses the same domain but with port 3001 for NeetoDeploy
 */
export const getWebhookBaseUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  // In production, check if we're on NeetoDeploy
  const origin = window.location.origin;
  if (origin.includes('neetodeployapp.com')) {
    // NeetoDeploy: Backend runs on port 3001, frontend typically on port 3000 or no port
    // Remove any existing port and add :3001
    const baseUrl = origin.replace(/:\d+$/, '');
    return `${baseUrl}:3001`;
  }

  // For other production environments, use the same origin
  return origin;
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

  // Check if this is a webhook endpoint (UUID pattern)
  const isWebhookEndpoint =
    /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(
      cleanEndpoint
    );

  // Webhook endpoints go directly to the backend without /api prefix
  if (isWebhookEndpoint) {
    return `${baseUrl}${cleanEndpoint}`;
  }

  // All other endpoints (including /proxy) get /api prefix in both development and production
  return `${baseUrl}/api${cleanEndpoint}`;
};

/**
 * Create a webhook URL that external services can use
 * @param {string} uuid - The webhook UUID
 * @returns {string} - The full webhook URL
 */
export const createWebhookUrl = (uuid) => {
  const baseUrl = getWebhookBaseUrl();
  return `${baseUrl}/${uuid}`;
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
  getWebhookBaseUrl,
  createApiUrl,
  createWebhookUrl,
  apiConfig,
};

export default apiUtils;
