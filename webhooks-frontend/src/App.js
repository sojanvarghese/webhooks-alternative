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
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
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

    setComposerSending(true);
    setComposerResponse(null);

    try {
      let requestData = {};

      // Parse JSON payload if it's not a GET request
      if (composerMethod !== "GET" && composerPayload.trim()) {
        try {
          requestData = JSON.parse(composerPayload);
        } catch (parseError) {
          throw new Error(`Invalid JSON payload: ${parseError.message}`);
        }
      }

      const config = {
        method: composerMethod,
        url: composerUrl,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      };

      if (composerMethod !== "GET" && Object.keys(requestData).length > 0) {
        config.data = requestData;
      }

      const response = await axios(config);

      setComposerResponse({
        success: true,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        timestamp: new Date().toISOString(),
      });

      Toastr.success("Request sent successfully!");
    } catch (error) {
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

    setFetchingPayloads(true);
    try {
      const response = await axios.get(
        createApiUrl(`/${uuid}?fetch_payloads=true`),
        {
          headers: {
            Accept: "application/json",
            Referer: window.location.origin,
          },
        }
      );
      setPayloads(response.data.payloads || []);
    } catch (err) {
      console.error("Error fetching payloads:", err);
      if (err.response?.status !== 404) {
        setError("Failed to fetch requests. Please refresh.");
      }
    } finally {
      setFetchingPayloads(false);
    }
  }, [uuid]);

  // Initialize UUID and URL on component mount
  useEffect(() => {
    const newUuid = generateUUID();
    setUuid(newUuid);
    const newUrl = createWebhookUrl(newUuid);
    setUrl(newUrl);
    setLoading(false);
  }, []);

  // Fetch payloads every 3 seconds
  useEffect(() => {
    if (!uuid) return;

    fetchPayloads(); // Initial fetch
    const interval = setInterval(fetchPayloads, 3000);
    return () => clearInterval(interval);
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
