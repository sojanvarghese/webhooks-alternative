import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// neetoUI styles imported in index.js
import {
  Spinner,
  Button,
  Toastr,
  Input,
  Tooltip,
  Textarea,
} from "@bigbinary/neetoui";
import { Copy } from "@bigbinary/neeto-icons";
import NeetoWebhooksLogo from "./components/NeetoWebhooksLogo";
import LandingPage from "./components/LandingPage";
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

// Main webhook testing application component
function MainApp() {
  // State to store the UUID
  const [uuid, setUuid] = useState(null);
  const [backendUuid, setBackendUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [payloads, setPayloads] = useState([]);
  const [fetchingPayloads, setFetchingPayloads] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // State for Request Composer
  const [composerMethod, setComposerMethod] = useState("POST");
  const [composerUrl, setComposerUrl] = useState("");
  const [composerPayload, setComposerPayload] = useState("");
  const [composerSending, setComposerSending] = useState(false);
  const [composerResponse, setComposerResponse] = useState(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.setAttribute(
      "data-theme",
      savedDarkMode ? "dark" : "light"
    );
  }, []);

  // On mount, get or generate UUID for this session
  useEffect(() => {
    let sessionUuid = sessionStorage.getItem("session_uuid");
    if (!sessionUuid) {
      sessionUuid = generateUUID();
      sessionStorage.setItem("session_uuid", sessionUuid);
    }
    setUuid(sessionUuid);
  }, []);

  // Fetch backend echo of UUID
  useEffect(() => {
    if (!uuid) return;
    setBackendUuid(uuid);
    setLoading(false);
  }, [uuid]);

  // Fetch payloads for this UUID
  const fetchPayloads = useCallback(() => {
    if (!uuid) return;
    setFetchingPayloads(true);
    axios
      .get(`http://localhost:3001/${uuid}?fetch_payloads=true`)
      .then((response) => {
        setPayloads(response.data.payloads || []);
        setFetchingPayloads(false);
      })
      .catch(() => {
        setFetchingPayloads(false);
        Toastr.error("Failed to fetch payloads", { autoClose: false });
      });
  }, [uuid]);

  useEffect(() => {
    if (uuid) fetchPayloads();
  }, [uuid, fetchPayloads]);

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

  // Get domain for display
  const domain = window.location.origin;
  const url = backendUuid ? `${domain}/${backendUuid}` : "";

  // Copy to clipboard handler
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard copy failed", err);
      setCopied(false);
      Toastr.error("Failed to copy to clipboard", { autoClose: false });
    }
  };

  // Helper function to get method color
  const getMethodColor = (method) => {
    const colors = {
      GET: "var(--method-get)",
      POST: "var(--method-post)",
      PUT: "var(--method-put)",
      DELETE: "var(--method-delete)",
      PATCH: "var(--method-patch)",
    };
    return colors[method?.toUpperCase()] || "var(--method-default)";
  };

  // Handle sending request via composer
  const handleSendComposerRequest = async () => {
    if (!composerUrl.trim()) {
      Toastr.error("Please enter a destination URL.");
      return;
    }

    setComposerSending(true);
    try {
      const response = await axios({
        method: composerMethod,
        url: composerUrl,
        data: composerPayload,
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Source": "webhooks-frontend", // Example header
        },
      });
      setComposerResponse({
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers,
        timestamp: new Date().toISOString(),
      });
      Toastr.success("Request sent successfully!");
    } catch (error) {
      setComposerResponse({
        success: false,
        status: error.response?.status || "N/A",
        data: error.response?.data || error.message,
        headers: error.response?.headers || {},
        timestamp: new Date().toISOString(),
        error: error.message,
      });
      Toastr.error("Failed to send request.");
    } finally {
      setComposerSending(false);
    }
  };

  // Generate and download PDF report
  const handleExportPDF = () => {
    if (payloads.length === 0) {
      Toastr.error("No data to export");
      return;
    }

    // Calculate statistics
    const methodCounts = payloads.reduce((acc, p) => {
      const method = p.method || "UNKNOWN";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const contentTypes = payloads.reduce((acc, p) => {
      const contentType = p.content_type || "Unknown";
      acc[contentType] = (acc[contentType] || 0) + 1;
      return acc;
    }, {});

    const uniqueIPs = [
      ...new Set(payloads.map((p) => p.ip_address).filter(Boolean)),
    ];
    const timeRange = {
      first: payloads[payloads.length - 1]?.created_at,
      last: payloads[0]?.created_at,
    };

    // Create PDF content
    const reportContent = `
NeetoWebhooks - Webhook Data Export Report
Generated: ${new Date().toLocaleString()}
Endpoint: ${url}

=== SUMMARY ===
Total Requests: ${payloads.length}
Unique IP Addresses: ${uniqueIPs.length}
Time Range: ${
      timeRange.first ? new Date(timeRange.first).toLocaleString() : "N/A"
    } - ${timeRange.last ? new Date(timeRange.last).toLocaleString() : "N/A"}

=== REQUEST METHODS ===
${Object.entries(methodCounts)
  .map(([method, count]) => `${method}: ${count}`)
  .join("\n")}

=== CONTENT TYPES ===
${Object.entries(contentTypes)
  .map(([type, count]) => `${type}: ${count}`)
  .join("\n")}

=== IP ADDRESSES ===
${uniqueIPs.join("\n")}

=== REQUEST DETAILS ===
${payloads
  .map(
    (p, idx) => `
Request #${idx + 1}
Method: ${p.method || "UNKNOWN"}
Timestamp: ${new Date(p.created_at).toLocaleString()}
IP: ${p.ip_address || "Unknown"}
Content-Type: ${p.content_type || "Unknown"}
User-Agent: ${p.user_agent || "Unknown"}
Headers Count: ${p.headers ? Object.keys(p.headers).length : 0}
Has Body: ${p.data ? "Yes" : "No"}
${
  p.query_params && Object.keys(p.query_params).length > 0
    ? `Query Params: ${JSON.stringify(p.query_params)}`
    : ""
}
`
  )
  .join("\n")}
    `.trim();

    // Create and download the file
    const blob = new Blob([reportContent], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `neeto-webhooks-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    Toastr.success("Report exported successfully!");
  };

  return (
    <main className="App">
      {/* Dark mode toggle */}
      <button
        className="dark-mode-toggle"
        onClick={toggleDarkMode}
        aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      >
        {darkMode ? (
          // Sun icon for light mode
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <header
        className="app-header"
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NeetoWebhooksLogo size="default" />
        <div className="text-secondary" style={{ fontSize: 14 }}>
          Session-based webhook testing
        </div>
      </header>

      <section
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 16, // Reduced from 32 to 16 for tighter spacing
          maxWidth: 1400, // Increased max width for better space utilization
          margin: "2rem auto", // Reduced from 3rem to 2rem
          padding: "0 1.5rem", // Reduced from 2rem to 1.5rem
        }}
      >
        {/* Left: Webhook endpoint info */}
        <div
          className="app-card endpoint-card"
          style={{
            flex: 1,
            minWidth: 300, // Reduced from 320
            maxWidth: 400, // Reduced from 420
            borderRadius: 12,
            padding: "1.5rem 1.25rem", // Reduced padding
            marginBottom: 0,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
          }}
        >
          {/* Title and description */}
          <h2
            className="text-primary"
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }} // Reduced sizes
          >
            Your webhook endpoint
          </h2>
          <p
            className="text-secondary"
            style={{ fontSize: "1rem", lineHeight: 1.6, marginBottom: 24 }} // Reduced from 1.1rem and 32
          >
            Instantly get a unique, session-based webhook URL. Send any HTTP
            request to this endpoint and see it appear in the request history.
            Share it, test integrations, or debug webhooks easily.
          </p>
          {/* Endpoint URL and copy button */}
          {loading ? (
            <Spinner size="large" />
          ) : error ? (
            <p style={{ color: "#dc2626", fontSize: "1rem" }}>{error}</p>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              <div className="themed-input" style={{ flex: 1 }}>
                <Input
                  value={url}
                  readOnly
                  size="large"
                  style={{ fontWeight: 600, fontSize: 16 }}
                  aria-label="Webhook endpoint URL"
                />
              </div>
              <Tooltip
                content={copied ? "Copied!" : "Copy to clipboard"}
                position="bottom"
              >
                <Button
                  variant="secondary"
                  icon={Copy}
                  onClick={handleCopy}
                  aria-label="Copy webhook endpoint"
                />
              </Tooltip>
            </div>
          )}

          {/* cURL Examples Section with scroll */}
          {url && (
            <div style={{ marginTop: 24, textAlign: "left", flex: 1 }}>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.125rem", // Reduced from 1.25rem
                  fontWeight: 600,
                  marginBottom: 12, // Reduced from 16
                  textAlign: "center",
                }}
              >
                cURL Examples
              </h3>
              <div
                className="curl-examples-scroll"
                style={{
                  maxHeight: "300px", // Added scroll container
                  overflowY: "auto",
                  paddingRight: "8px", // Space for scrollbar
                }}
              >
                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  <div
                    className="text-secondary"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                  >
                    POST with JSON payload:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 11,
                      overflow: "auto",
                    }}
                  >
                    {`curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "test", "data": {"key": "value"}}'`}
                  </pre>
                </div>

                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  <div
                    className="text-secondary"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                  >
                    GET with query parameters:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 11,
                      overflow: "auto",
                    }}
                  >
                    {`curl -X GET "${url}?source=test&action=webhook"`}
                  </pre>
                </div>

                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  <div
                    className="text-secondary"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                  >
                    POST with custom headers:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 11,
                      overflow: "auto",
                    }}
                  >
                    {`curl -X POST "${url}" \\
  -H "Authorization: Bearer your-token" \\
  -H "X-Webhook-Source: your-app" \\
  -d '{"timestamp": "${new Date().toISOString()}"}'`}
                  </pre>
                </div>

                <div style={{ fontSize: 13 }}>
                  <div
                    className="text-secondary"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                  >
                    PUT request:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 11,
                      overflow: "auto",
                    }}
                  >
                    {`curl -X PUT "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"updated_at": "${new Date().toISOString()}"}'`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Request history with enhanced scroll */}
        <div
          className="app-card history-card"
          style={{
            flex: 2,
            minWidth: 400, // Increased from 340
            maxWidth: 800, // Increased from 700
            borderRadius: 12,
            padding: "1.5rem 1.25rem", // Reduced padding
            marginBottom: 0,
            display: "flex",
            flexDirection: "column",
            height: "600px", // Fixed height for better layout control
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12, // Reduced from 16
              flexShrink: 0, // Prevent shrinking
            }}
          >
            <h3
              className="text-primary"
              style={{ fontSize: "1.375rem", fontWeight: 600 }} // Reduced from 1.5rem
            >
              Request History
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                label="Export Data"
                variant="secondary"
                size="small"
                onClick={handleExportPDF}
                disabled={payloads.length === 0}
              />
              <Button
                label="Refresh"
                variant="secondary"
                size="small"
                onClick={fetchPayloads}
                loading={fetchingPayloads}
              />
            </div>
          </div>
          <p
            className="text-secondary"
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: 16,
              flexShrink: 0,
            }} // Reduced from 1rem and added flexShrink
          >
            All HTTP requests sent to your endpoint will appear here. Try
            sending a <code>POST</code>, <code>GET</code>, or <code>PUT</code>{" "}
            request using{" "}
            <a
              href="https://curl.se/"
              target="_blank"
              rel="noopener noreferrer"
            >
              curl
            </a>
            , Postman, or your favorite tool.
          </p>

          {/* Scrollable content area */}
          <div
            className="request-history-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "8px",
              minHeight: 0, // Important for flex child scrolling
            }}
          >
            {fetchingPayloads ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <Spinner size="small" />
              </div>
            ) : payloads.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p
                  className="text-primary"
                  style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}
                >
                  No requests received yet.
                </p>
                <p className="text-secondary" style={{ fontSize: "1rem" }}>
                  Waiting for your first webhook request...
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                {payloads.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="request-item"
                    style={{ borderRadius: 8, padding: 14, marginBottom: 12 }} // Reduced padding and margin
                  >
                    {/* Request summary header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          background: getMethodColor(p.method),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          minWidth: 60,
                          textAlign: "center",
                        }}
                      >
                        {p.method || "POST"}
                      </span>
                      <span
                        className="text-tertiary"
                        style={{ fontSize: 12, flex: 1 }}
                      >
                        {new Date(p.created_at).toLocaleString()}
                      </span>
                      <span className="text-tertiary" style={{ fontSize: 12 }}>
                        {p.ip_address || "Unknown IP"}
                      </span>
                    </div>

                    {/* Request details */}
                    <div style={{ marginBottom: 12 }}>
                      <div
                        className="text-secondary"
                        style={{ fontSize: 13, marginBottom: 4 }}
                      >
                        <strong>Content-Type:</strong>{" "}
                        {p.content_type || "application/json"}
                      </div>
                      {p.user_agent && (
                        <div
                          className="text-secondary"
                          style={{ fontSize: 13, marginBottom: 4 }}
                        >
                          <strong>User-Agent:</strong>{" "}
                          {p.user_agent.substring(0, 80)}
                          {p.user_agent.length > 80 ? "..." : ""}
                        </div>
                      )}
                      {p.query_params &&
                        Object.keys(p.query_params).length > 0 && (
                          <div
                            className="text-secondary"
                            style={{ fontSize: 13, marginBottom: 4 }}
                          >
                            <strong>Query Params:</strong>{" "}
                            {JSON.stringify(p.query_params)}
                          </div>
                        )}
                    </div>

                    {/* Headers section */}
                    {p.headers && Object.keys(p.headers).length > 0 && (
                      <details style={{ marginBottom: 12 }}>
                        <summary
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          Headers ({Object.keys(p.headers).length})
                        </summary>
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            fontFamily: "monospace",
                          }}
                        >
                          {Object.entries(p.headers).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: 2 }}>
                              <span className="text-secondary">{key}:</span>{" "}
                              <span className="text-primary">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* Payload data */}
                    {p.data && (
                      <details open>
                        <summary
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          Request Body
                        </summary>
                        <pre
                          className="code-block"
                          style={{
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                            fontSize: 12,
                            padding: 12,
                            borderRadius: 4,
                          }}
                        >
                          {JSON.stringify(p.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Request Composer Section - Improved Layout */}
      <section
        style={{ maxWidth: 1400, margin: "1rem auto", padding: "0 1.5rem" }}
      >
        <div
          className="app-card composer-card"
          style={{ borderRadius: 12, padding: "1.5rem" }}
        >
          <h3
            className="text-primary"
            style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 16 }}
          >
            Request Composer
          </h3>
          <p
            className="text-secondary"
            style={{ fontSize: "1rem", lineHeight: 1.6, marginBottom: 24 }}
          >
            Compose and send HTTP requests to any destination. Test your
            webhooks, APIs, or third-party integrations.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 24,
              marginBottom: 24,
            }}
          >
            {/* Left: Request configuration */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <label
                  className="text-primary"
                  style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
                >
                  HTTP Method
                </label>
                <select
                  value={composerMethod}
                  onChange={(e) => setComposerMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-primary)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                  }}
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  className="text-primary"
                  style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
                >
                  Destination URL
                </label>
                <div className="themed-input">
                  <Input
                    value={composerUrl}
                    onChange={(e) => setComposerUrl(e.target.value)}
                    placeholder="https://api.example.com/webhook"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <Button
                  label={composerSending ? "Sending..." : "Send Request"}
                  variant="primary"
                  loading={composerSending}
                  onClick={handleSendComposerRequest}
                  disabled={composerSending || !composerUrl.trim()}
                  style={{ width: "100%" }}
                  className="gradient-primary-button"
                />
              </div>
            </div>

            {/* Right: Request body */}
            <div>
              <label
                className="text-primary"
                style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
              >
                Request Body (JSON)
              </label>
              <Textarea
                value={composerPayload}
                onChange={(e) => setComposerPayload(e.target.value)}
                placeholder='{"message": "Hello World", "timestamp": "2025-01-08T12:00:00Z"}'
                rows={8}
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Response section */}
          {composerResponse && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 8,
                border: "1px solid var(--border-primary)",
                background: "var(--bg-tertiary)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    background: composerResponse.success
                      ? "#10b981"
                      : "#ef4444",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {composerResponse.success ? "SUCCESS" : "ERROR"}
                </span>
                {composerResponse.status && (
                  <span className="text-secondary" style={{ fontSize: 13 }}>
                    Status: {composerResponse.status}
                  </span>
                )}
                <span
                  className="text-tertiary"
                  style={{ fontSize: 12, marginLeft: "auto" }}
                >
                  {new Date(composerResponse.timestamp).toLocaleString()}
                </span>
              </div>

              {composerResponse.data && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    className="text-primary"
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                  >
                    Response Body:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 4,
                      fontSize: 12,
                      maxHeight: 200,
                      overflow: "auto",
                    }}
                  >
                    {typeof composerResponse.data === "string"
                      ? composerResponse.data
                      : JSON.stringify(composerResponse.data, null, 2)}
                  </pre>
                </div>
              )}

              {composerResponse.headers &&
                Object.keys(composerResponse.headers).length > 0 && (
                  <details>
                    <summary
                      className="text-primary"
                      style={{
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Response Headers (
                      {Object.keys(composerResponse.headers).length})
                    </summary>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        fontFamily: "monospace",
                      }}
                    >
                      {Object.entries(composerResponse.headers).map(
                        ([key, value]) => (
                          <div key={key} style={{ marginBottom: 2 }}>
                            <span className="text-secondary">{key}:</span>{" "}
                            <span className="text-primary">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </details>
                )}

              {composerResponse.error && (
                <div style={{ marginTop: 12 }}>
                  <div
                    className="text-primary"
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                  >
                    Error Details:
                  </div>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 4,
                      fontSize: 12,
                      color: "#ef4444",
                    }}
                  >
                    {composerResponse.error}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "1rem 0 3rem 0" }}>
        <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
          Inspired by{" "}
          <a
            href="https://webhook.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Webhook.site
          </a>
          . Your endpoint is unique to this browser session and will reset in a
          new private window.
        </p>
      </footer>
    </main>
  );
}

// Main App component with routing logic
function App() {
  // State to control which view to show
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Handle start testing - navigate to main app
  const handleStartTesting = () => {
    setShowLandingPage(false);
  };

  // Show landing page if user hasn't started testing yet
  if (showLandingPage) {
    return <LandingPage onStartTesting={handleStartTesting} />;
  }

  // Show main webhook testing app
  return <MainApp />;
}

export default App;
