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
  Typography,
  Select,
} from "@bigbinary/neetoui";
import { Copy, Sun, Moon } from "@bigbinary/neeto-icons";
import NeetoWebhooksLogo from "./components/NeetoWebhooksLogo";
import LandingPage from "./components/LandingPage";
import JsonViewer from "./components/JsonViewer";
import { createApiUrl } from "./config/api";
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
function MainApp({ darkMode, toggleDarkMode }) {
  // State to store the UUID
  const [uuid, setUuid] = useState(null);
  const [backendUuid, setBackendUuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [copied, setCopied] = useState(false);
  const [payloads, setPayloads] = useState([]);
  const [fetchingPayloads, setFetchingPayloads] = useState(false);

  // State for Request Composer
  const [composerMethod, setComposerMethod] = useState("POST");
  const [composerUrl, setComposerUrl] = useState("");
  const [composerPayload, setComposerPayload] = useState("");
  const [composerSending, setComposerSending] = useState(false);
  const [composerResponse, setComposerResponse] = useState(null);

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
      .get(createApiUrl(`${uuid}?fetch_payloads=true`))
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

  // Get domain for display - use API base URL for webhook endpoint
  const domain = createApiUrl("").replace(/\/$/, ""); // Remove trailing slash
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Typography as="body2" className="text-secondary">
            Session-based webhook testing
          </Typography>
          {/* Dark mode toggle button in header */}
          <Button
            variant="text"
            icon={darkMode ? Sun : Moon}
            onClick={toggleDarkMode}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            size="large"
          />
        </div>
      </header>

      <section
        style={{ maxWidth: 1400, margin: "2rem auto", padding: "0 1.5rem" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* Left: Webhook endpoint info */}
          <div
            className="app-card endpoint-card"
            style={{
              flex: 1,
              minWidth: 300,
              maxWidth: 400,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              height: "fit-content",
              borderRadius: 12,
              padding: "1.5rem 1.25rem",
            }}
          >
            {/* Title and description */}
            <Typography as="h2" weight="bold" className="mb-2">
              Your webhook endpoint
            </Typography>
            <Typography as="body1" className="text-secondary mb-4">
              Instantly get a unique, session-based webhook URL. Send any HTTP
              request to this endpoint and see it appear in the request history.
              Share it, test integrations, or debug webhooks easily.
            </Typography>
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
                <div style={{ flex: 1 }}>
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
              minWidth: 400,
              maxWidth: 800,
              display: "flex",
              flexDirection: "column",
              height: "600px",
              borderRadius: 12,
              padding: "1.5rem 1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                flexShrink: 0,
              }}
            >
              <Typography as="h3" weight="semibold">
                Request History
              </Typography>
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
                        <span
                          className="text-tertiary"
                          style={{ fontSize: 12 }}
                        >
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
                          <JsonViewer data={p.data} />
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
          <Typography as="h3" weight="semibold" className="mb-2">
            Request Composer
          </Typography>
          <Typography as="body1" className="text-secondary mb-4">
            Compose and send HTTP requests to any destination. Test your
            webhooks, APIs, or third-party integrations.
          </Typography>

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
                <Typography as="body2" weight="medium" className="mb-2">
                  HTTP Method
                </Typography>
                <Select
                  value={{ label: composerMethod, value: composerMethod }}
                  onChange={(selectedOption) =>
                    setComposerMethod(selectedOption.value)
                  }
                  options={[
                    { label: "POST", value: "POST" },
                    { label: "GET", value: "GET" },
                    { label: "PUT", value: "PUT" },
                    { label: "PATCH", value: "PATCH" },
                    { label: "DELETE", value: "DELETE" },
                  ]}
                  isSearchable={false}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Typography as="body2" weight="medium" className="mb-2">
                  Destination URL
                </Typography>
                <Input
                  value={composerUrl}
                  onChange={(e) => setComposerUrl(e.target.value)}
                  placeholder="https://api.example.com/webhook"
                  style={{ width: "100%" }}
                />
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
              <Typography as="body2" weight="medium" className="mb-2">
                Request Body (JSON)
              </Typography>
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
              className="app-card"
              style={{ marginTop: 24, borderRadius: 8, padding: 16 }}
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
                      ? "var(--neeto-ui-success-600)"
                      : "var(--neeto-ui-danger-600)",
                    color: "var(--neeto-ui-white)",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {composerResponse.success ? "SUCCESS" : "ERROR"}
                </span>
                {composerResponse.status && (
                  <Typography style="body2" color="secondary">
                    Status: {composerResponse.status}
                  </Typography>
                )}
                <div style={{ marginLeft: "auto" }}>
                  <Typography style="body3" color="tertiary">
                    {new Date(composerResponse.timestamp).toLocaleString()}
                  </Typography>
                </div>
              </div>

              {composerResponse.data && (
                <div style={{ marginBottom: 12 }}>
                  <Typography style="body2" weight="medium" marginBottom="xs">
                    Response Body:
                  </Typography>
                  <div style={{ maxHeight: 200, overflow: "auto" }}>
                    <JsonViewer data={composerResponse.data} />
                  </div>
                </div>
              )}

              {composerResponse.headers &&
                Object.keys(composerResponse.headers).length > 0 && (
                  <details>
                    <summary style={{ cursor: "pointer" }}>
                      <Typography style="body2" weight="medium">
                        Response Headers (
                        {Object.keys(composerResponse.headers).length})
                      </Typography>
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
                            <Typography
                              style="body3"
                              color="secondary"
                              component="span"
                            >
                              {key}:
                            </Typography>{" "}
                            <Typography style="body3" component="span">
                              {value}
                            </Typography>
                          </div>
                        )
                      )}
                    </div>
                  </details>
                )}

              {composerResponse.error && (
                <div style={{ marginTop: 12 }}>
                  <Typography style="body2" weight="medium" marginBottom="xs">
                    Error Details:
                  </Typography>
                  <pre
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 4,
                      fontSize: 12,
                      color: "var(--neeto-ui-danger-600)",
                      backgroundColor: "var(--neeto-ui-gray-100)",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
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
        <Typography style="body2" color="secondary">
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
        </Typography>
      </footer>
    </main>
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
