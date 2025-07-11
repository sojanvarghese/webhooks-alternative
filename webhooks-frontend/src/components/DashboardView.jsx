import React, { useState } from "react";
import { Button, Spinner, Input, Tooltip, NoData } from "@bigbinary/neetoui";
import { Copy, Check } from "@bigbinary/neeto-icons";
import JsonViewer from "./JsonViewer";

const CURL_EXAMPLES = [
  {
    label: "POST with JSON payload:",
    getCode: (url) => `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"event": "test", "data": {"key": "value"}}'`,
  },
  {
    label: "GET with query parameters:",
    getCode: (url) => `curl -X GET "${url}?source=test&action=webhook"`,
  },
  {
    label: "POST with custom headers:",
    getCode: (url) => `curl -X POST "${url}" \\\n  -H "Authorization: Bearer your-token" \\\n  -H "X-Webhook-Source: your-app" \\\n  -d '{"timestamp": "${new Date().toISOString()}"}'`,
  },
  {
    label: "PUT request:",
    getCode: (url) => `curl -X PUT "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"updated_at": "${new Date().toISOString()}"}'`,
  },
];

const DashboardView = ({
  loading,
  error,
  url,
  copied,
  handleCopy,
  payloads,
  fetchingPayloads,
  handleExportPDF,
  fetchPayloads,
  getMethodColor,
  darkMode,
}) => {
  // Track which example was just copied
  const [copiedExample, setCopiedExample] = useState(null);
  // Track endpoint copy animation
  const [endpointCopied, setEndpointCopied] = useState(false);

  // Copy handler for examples
  const handleCopyExample = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedExample(idx);
    setTimeout(() => setCopiedExample(null), 1500);
  };

  // Copy handler for endpoint
  const handleEndpointCopy = () => {
    handleCopy();
    setEndpointCopied(true);
    setTimeout(() => setEndpointCopied(false), 1500);
  };

  return (
    <section style={{
      maxWidth: 1400,
      margin: "0 auto",
      padding: "2rem 1.5rem",
      minHeight: "calc(100vh - 140px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left: Webhook endpoint info */}
        <div
          className="app-card endpoint-card"
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 450,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            maxHeight: "calc(100vh - 200px)",
            borderRadius: 12,
            padding: "2rem 1.5rem",
            boxShadow: "0 2px 8px rgba(34, 197, 94, 0.04)",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "all 0.2s ease",
          }}
        >
          {/* Title and description */}
          <h2 style={{
            margin: "0 0 1rem 0",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: darkMode ? "#f9fafb" : "#111827"
          }}>
            Your webhook endpoint
          </h2>
          <p style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1rem",
            lineHeight: 1.6,
            color: darkMode ? "#d1d5db" : "#6b7280"
          }}>
            Instantly get a unique, session-based webhook URL. Send any HTTP
            request to this endpoint and see it appear in the request history.
            Share it, test integrations, or debug webhooks easily.
          </p>

          {/* Endpoint URL and copy button */}
          {loading ? (
            <div style={{ padding: "2rem 0" }}>
              <Spinner size="large" />
            </div>
          ) : error ? (
            <div style={{
              color: "#dc2626",
              fontSize: "1rem",
              padding: "1rem",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca"
            }}>
              {error}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
                maxWidth: 500,
                margin: "0 auto",
                marginBottom: "2rem",
                position: "relative"
              }}
            >
              <div style={{ flex: 1 }}>
                <Input
                  value={url}
                  readOnly
                  size="large"
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    fontFamily: "monospace"
                  }}
                  aria-label="Webhook endpoint URL"
                />
              </div>
              <Tooltip
                content={copied ? "Copied!" : "Copy to clipboard"}
                position="bottom"
              >
                <Button
                  variant="secondary"
                  icon={endpointCopied ? Check : Copy}
                  onClick={() => {
                    handleCopy();
                    setEndpointCopied(true);
                    setTimeout(() => setEndpointCopied(false), 1500);
                  }}
                  aria-label="Copy webhook endpoint"
                  size="large"
                  className={endpointCopied ? "endpoint-copy-btn copied" : "endpoint-copy-btn"}
                />
              </Tooltip>
            </div>
          )}

          {/* cURL Examples Section with controlled scroll */}
          {url && (
            <div style={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                margin: "0 0 1rem 0",
                textAlign: "center",
                color: "#059669"
              }}>
                cURL Examples
              </h3>

              <div
                className="curl-examples-scroll"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#D1D5DB #F9FAFB"
                }}
              >
                {CURL_EXAMPLES.map((ex, idx) => {
                  const code = ex.getCode(url);
                  return (
                    <div
                      key={idx}
                      className="curl-example-container"
                      style={{
                        position: "relative",
                        marginBottom: 20,
                        borderRadius: 8,
                        transition: "box-shadow 0.2s",
                        background: "none"
                      }}
                    >
                      <p style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        margin: "0 0 0.5rem 0",
                        color: "#374151"
                      }}>
                        {ex.label}
                      </p>
                      <div style={{ position: "relative" }}>
                        <pre
                          className="code-block"
                          style={{
                            margin: 0,
                            padding: 16,
                            borderRadius: 8,
                            fontSize: 12,
                            lineHeight: 1.5,
                            overflow: "auto",
                            position: "relative"
                          }}
                        >
                          {code}
                        </pre>
                        <span
                          className={
                            copiedExample === idx
                              ? "curl-copy-btn-wrapper curl-copy-btn copied"
                              : "curl-copy-btn-wrapper curl-copy-btn"
                          }
                        >
                          <Tooltip content={copiedExample === idx ? "Copied!" : "Copy example"} position="left">
                            <Button
                              style="icon"
                              size="small"
                              icon={copiedExample === idx ? Check : Copy}
                              aria-label="Copy cURL example"
                              onClick={() => handleCopyExample(code, idx)}
                            />
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Request history with better scroll management */}
        <div
          className="app-card request-history-card"
          style={{
            flex: 1,
            minWidth: 600,
            display: "flex",
            flexDirection: "column",
            borderRadius: 12,
            padding: "2rem 1.5rem",
            maxHeight: "calc(100vh - 200px)", // Prevent excessive height
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              flexShrink: 0,
            }}
          >
            <h3 style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: darkMode ? "#f9fafb" : "#111827"
            }}>
              Request History
            </h3>
            <div style={{ display: "flex", gap: 12 }}>
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

          <div style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            {fetchingPayloads && payloads.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                <Spinner size="large" color={darkMode ? "white" : "primary"} />
              </div>
            ) : payloads.length === 0 ? (
              <NoData
                title="No requests yet"
                description="Send a request to your endpoint to see it appear here."
                style={{ margin: "2rem 0" }}
              />
            ) : (
              <div
                className="request-history-scroll"
                style={{
                  height: "100%",
                  overflowY: "auto",
                  paddingRight: "8px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#D1D5DB #F9FAFB"
                }}
              >
                {payloads.map((p, index) => (
                  <div
                    key={index}
                    className="app-card"
                    style={{
                      marginBottom: 20,
                      padding: 20,
                      borderRadius: 8,
                      fontSize: 14,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Request header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span
                          style={{
                            background: getMethodColor(p.method),
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            minWidth: "60px",
                            textAlign: "center",
                          }}
                        >
                          {p.method || "UNKNOWN"}
                        </span>
                        <span style={{
                          fontSize: "0.875rem",
                          color: "#6b7280"
                        }}>
                          {p.ip_address || "Unknown IP"}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.75rem",
                        color: "#6b7280"
                      }}>
                        {new Date(p.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Request details */}
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 13,
                          marginBottom: 8,
                          lineHeight: 1.4,
                          color: "#6b7280"
                        }}
                      >
                        <strong>Content-Type:</strong>{" "}
                        {p.content_type || "application/json"}
                      </div>
                      {p.user_agent && (
                        <div
                          style={{
                            fontSize: 13,
                            marginBottom: 8,
                            lineHeight: 1.4,
                            color: "#6b7280"
                          }}
                        >
                          <strong>User-Agent:</strong>{" "}
                          {p.user_agent.substring(0, 80)}
                          {p.user_agent.length > 80 ? "..." : ""}
                        </div>
                      )}
                      {p.query_params &&
                        Object.keys(p.query_params).length > 0 && (
                          <div
                            style={{
                              fontSize: 13,
                              marginBottom: 8,
                              lineHeight: 1.4,
                              color: "#6b7280"
                            }}
                          >
                            <strong>Query Params:</strong>{" "}
                            {JSON.stringify(p.query_params)}
                          </div>
                        )}
                    </div>

                    {/* Headers section */}
                    {p.headers && Object.keys(p.headers).length > 0 && (
                      <details style={{ marginBottom: 16 }}>
                        <summary
                          style={{
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            padding: "4px 0",
                            color: "#111827"
                          }}
                        >
                          Headers ({Object.keys(p.headers).length})
                        </summary>
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 12,
                            fontFamily: "monospace",
                            backgroundColor: "#f9fafb",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {Object.entries(p.headers).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: 4, lineHeight: 1.4 }}>
                              <span style={{ color: "#6b7280" }}>{key}:</span>{" "}
                              <span style={{ color: "#111827" }}>
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
                          style={{
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 12,
                            padding: "4px 0",
                            color: "#111827"
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
  );
};

export default DashboardView;
