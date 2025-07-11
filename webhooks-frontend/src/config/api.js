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
    console.log("[API CONFIG] Development mode detected, using localhost:3001");
    return "http://localhost:3001";
  }

  // In production, use the same origin (proxy setup handles backend routing)
  const baseUrl = window.location.origin;
  console.log("[API CONFIG] Production mode detected, using:", baseUrl);
  return baseUrl;
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
    console.log(
      "[WEBHOOK CONFIG] Development mode detected, using localhost:3001"
    );
    return "http://localhost:3001";
  }

  // In production, use the same origin (proxy setup handles webhook routing)
  const baseUrl = window.location.origin;
  console.log("[WEBHOOK CONFIG] Production mode detected, using:", baseUrl);
  return baseUrl;
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

  let finalUrl;
  // Webhook endpoints go directly to the backend without /api prefix
  if (isWebhookEndpoint) {
    finalUrl = `${baseUrl}${cleanEndpoint}`;
    console.log("[API CONFIG] Created webhook endpoint URL:", finalUrl);
  } else {
    // All other endpoints (including /proxy) get /api prefix in both development and production
    finalUrl = `${baseUrl}/api${cleanEndpoint}`;
    console.log("[API CONFIG] Created API endpoint URL:", finalUrl);
  }

  return finalUrl;
};

/**
 * Create a webhook URL that external services can use
 * @param {string} uuid - The webhook UUID
 * @returns {string} - The full webhook URL
 */
export const createWebhookUrl = (uuid) => {
  const baseUrl = getWebhookBaseUrl();
  const webhookUrl = `${baseUrl}/${uuid}`;
  console.log(
    "[WEBHOOK CONFIG] Created webhook URL:",
    webhookUrl,
    "for UUID:",
    uuid
  );
  return webhookUrl;
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
