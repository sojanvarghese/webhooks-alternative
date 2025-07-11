import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// neetoUI styles imported in index.js
import { Toastr } from "@bigbinary/neetoui";
import LandingPage from "./components/LandingPage";
import MainLayout from "./components/MainLayout";
import { createApiUrl, createWebhookUrl } from "./config/api";
import "./App.css";

// Helper to generate a UUID (v4)
function generateUUID() {
  console.log("[UUID GENERATOR] Generating new UUID...");
  const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
  console.log("[UUID GENERATOR] Generated UUID:", uuid);
  return uuid;
}

function MainApp({ darkMode, toggleDarkMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [uuid, setUuid] = useState("");
  const [payloads, setPayloads] = useState([]);
  const [fetchingPayloads, setFetchingPayloads] = useState(false);
  const [copied, setCopied] = useState(false);

  // Request composer state
  const [composerMethod, setComposerMethod] = useState("POST");
  const [composerUrl, setComposerUrl] = useState("");
  const [composerPayload, setComposerPayload] = useState(
    '{\n  "message": "Hello World",\n  "timestamp": "' +
      new Date().toISOString() +
      '"\n}'
  );
  const [composerSending, setComposerSending] = useState(false);
  const [composerResponse, setComposerResponse] = useState(null);

  // Copy URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get color for HTTP method
  const getMethodColor = (method) => {
    const colors = {
      GET: "#059669", // emerald-600
      POST: "#2563eb", // blue-600
      PUT: "#d97706", // amber-600
      DELETE: "#dc2626", // red-600
      PATCH: "#7c3aed", // violet-600
    };
    return colors[method] || "#6b7280"; // gray-500
  };

  // Handle sending request via composer
  const handleSendComposerRequest = async () => {
    if (!composerUrl.trim()) return;

    console.log("[REQUEST COMPOSER] Starting request:", {
      method: composerMethod,
      url: composerUrl,
      payloadLength: composerPayload.length,
      timestamp: new Date().toISOString(),
    });

    setComposerSending(true);
    setComposerResponse(null);

    try {
      let requestData = {};

      // Parse JSON payload if it's not a GET request
      if (composerMethod !== "GET" && composerPayload.trim()) {
        console.log("[REQUEST COMPOSER] Parsing JSON payload...");
        try {
          requestData = JSON.parse(composerPayload);
          console.log(
            "[REQUEST COMPOSER] JSON payload parsed successfully:",
            requestData
          );
        } catch (parseError) {
          console.error("[REQUEST COMPOSER] JSON parse error:", parseError);
          throw new Error(`Invalid JSON payload: ${parseError.message}`);
        }
      } else {
        console.log(
          "[REQUEST COMPOSER] Skipping JSON parsing (GET request or empty payload)"
        );
      }

      // Use backend proxy to avoid CORS issues
      const proxyPayload = {
        method: composerMethod,
        url: composerUrl,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          composerMethod !== "GET" && Object.keys(requestData).length > 0
            ? requestData
            : null,
      };

      console.log("[REQUEST COMPOSER] Sending proxy request:", {
        proxyUrl: createApiUrl("/proxy"),
        proxyPayload: proxyPayload,
        timestamp: new Date().toISOString(),
      });

      // New commit
      const response = await axios.post(createApiUrl("/proxy"), proxyPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      console.log("[REQUEST COMPOSER] Proxy response received:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        timestamp: new Date().toISOString(),
      });

      // Extract the response data from the proxy response
      const proxyResponse = response.data;

      setComposerResponse({
        success: proxyResponse.success,
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        data: proxyResponse.data,
        headers: proxyResponse.headers,
        timestamp: proxyResponse.timestamp,
      });

      if (proxyResponse.success) {
        console.log("[REQUEST COMPOSER] Request succeeded:", {
          status: proxyResponse.status,
          timestamp: proxyResponse.timestamp,
        });
        Toastr.success("Request sent successfully!");
      } else {
        console.warn(
          "[REQUEST COMPOSER] Request failed (proxy success=false):",
          {
            status: proxyResponse.status,
            error: proxyResponse.error,
            timestamp: proxyResponse.timestamp,
          }
        );
        Toastr.error(
          `Request failed: ${proxyResponse.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("[REQUEST COMPOSER] Request error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
      });

      setComposerResponse({
        success: false,
        status: error.response?.status || null,
        statusText: error.response?.statusText || null,
        data: error.response?.data || null,
        headers: error.response?.headers || {},
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      Toastr.error(`Request failed: ${error.message}`);
    } finally {
      console.log(
        "[REQUEST COMPOSER] Request completed, resetting loading state"
      );
      setComposerSending(false);
    }
  };

  // Export data as PDF
  const handleExportPDF = () => {
    const content = payloads
      .map((p, i) => {
        return `Request ${i + 1}:
Method: ${p.method || "UNKNOWN"}
Timestamp: ${new Date(p.created_at).toLocaleString()}
IP: ${p.ip_address || "Unknown"}
Content-Type: ${p.content_type || "application/json"}
User-Agent: ${p.user_agent || "N/A"}
Headers: ${JSON.stringify(p.headers, null, 2)}
Data: ${JSON.stringify(p.data, null, 2)}
`;
      })
      .join("\n\n" + "=".repeat(50) + "\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webhook-requests-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toastr.success("Export completed!");
  };

  // Fetch payloads from the server
  const fetchPayloads = useCallback(async () => {
    if (!uuid) return;

    console.log("[FETCH PAYLOADS] Starting fetch request for UUID:", uuid);
    setFetchingPayloads(true);
    try {
      const apiUrl = createApiUrl(`/${uuid}?fetch_payloads=true`);
      console.log("[FETCH PAYLOADS] Making request to:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      console.log("[FETCH PAYLOADS] Response received:", {
        status: response.status,
        statusText: response.statusText,
        payloadCount: response.data.payloads?.length || 0,
        timestamp: new Date().toISOString(),
      });

      setPayloads(response.data.payloads || []);

      // Clear any previous errors on successful fetch
      if (error) {
        console.log("[FETCH PAYLOADS] Clearing previous error state");
        setError(null);
      }
    } catch (err) {
      console.error("[FETCH PAYLOADS] Request failed:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        timestamp: new Date().toISOString(),
      });

      if (err.response?.status !== 404) {
        console.error("[FETCH PAYLOADS] Setting error state");
        setError("Failed to fetch requests. Please refresh.");
      } else {
        console.log("[FETCH PAYLOADS] 404 response - endpoint not found yet");
      }
    } finally {
      console.log("[FETCH PAYLOADS] Fetch completed, resetting loading state");
      setFetchingPayloads(false);
    }
  }, [uuid]);

  // Initialize UUID and URL on component mount
  useEffect(() => {
    console.log("[APP INIT] Initializing component...");
    const newUuid = generateUUID();
    console.log("[APP INIT] Generated UUID:", newUuid);

    setUuid(newUuid);

    const newUrl = createWebhookUrl(newUuid);
    console.log("[APP INIT] Generated webhook URL:", newUrl);

    setUrl(newUrl);
    setLoading(false);

    console.log("[APP INIT] Component initialization complete");
  }, []);

  // Fetch payloads every 3 seconds
  useEffect(() => {
    if (!uuid) return;

    console.log("[PAYLOAD POLLING] Starting payload polling for UUID:", uuid);

    fetchPayloads(); // Initial fetch
    const interval = setInterval(() => {
      console.log("[PAYLOAD POLLING] Executing scheduled fetch");
      fetchPayloads();
    }, 3000);

    return () => {
      console.log("[PAYLOAD POLLING] Cleaning up payload polling interval");
      clearInterval(interval);
    };
  }, [uuid, fetchPayloads]);

  return (
    <MainLayout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      // Dashboard props
      loading={loading}
      error={error}
      url={url}
      copied={copied}
      handleCopy={handleCopy}
      payloads={payloads}
      fetchingPayloads={fetchingPayloads}
      handleExportPDF={handleExportPDF}
      fetchPayloads={fetchPayloads}
      getMethodColor={getMethodColor}
      // Composer props
      composerMethod={composerMethod}
      setComposerMethod={setComposerMethod}
      composerUrl={composerUrl}
      setComposerUrl={setComposerUrl}
      composerPayload={composerPayload}
      setComposerPayload={setComposerPayload}
      composerSending={composerSending}
      handleSendComposerRequest={handleSendComposerRequest}
      composerResponse={composerResponse}
    />
  );
}

// Main App component with routing logic
function App() {
  // State to control which view to show
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.setAttribute(
      "data-theme",
      savedDarkMode ? "dark" : "light"
    );
  }, []);

  // Handle start testing - navigate to main app
  const handleStartTesting = () => {
    setShowLandingPage(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.setAttribute(
      "data-theme",
      newDarkMode ? "dark" : "light"
    );
  };

  // Show landing page if user hasn't started testing yet
  if (showLandingPage) {
    return (
      <LandingPage
        onStartTesting={handleStartTesting}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Show main webhook testing app
  return <MainApp darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
}

export default App;
