import React from "react";
import { Button, Spinner, Input, Tooltip, NoData, Accordion, Toastr } from "@bigbinary/neetoui";
import { Copy, Code } from "@bigbinary/neeto-icons";
import JsonViewer from "./JsonViewer";

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

  // Enhanced copy handler with Toastr notification
  const handleCopyWithNotification = () => {
    handleCopy();
    Toastr.success("Webhook URL copied to clipboard!", { autoClose: 2000 });
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
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 450,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            maxHeight: "calc(100vh - 200px)",
            borderRadius: "var(--neeto-ui-rounded-lg)",
            padding: "var(--neeto-ui-spacing-8) var(--neeto-ui-spacing-6)",
            boxShadow: "var(--neeto-ui-shadow-md)",
            backgroundColor: "rgb(var(--neeto-ui-white))",
            border: "1px solid rgb(var(--neeto-ui-gray-300))",
            color: "rgb(var(--neeto-ui-gray-800))",
            transition: "all 0.2s ease",
          }}
        >
          {/* Enhanced Typography */}
          <h2 style={{
            margin: "0 0 var(--neeto-ui-spacing-4) 0",
            fontSize: "var(--neeto-ui-text-xl)",
            fontWeight: "var(--neeto-ui-font-semibold)",
            color: "rgb(var(--neeto-ui-gray-900))",
            textAlign: "center"
          }}>
            Your webhook endpoint
          </h2>
          <p style={{
            margin: "0 0 var(--neeto-ui-spacing-6) 0",
            fontSize: "var(--neeto-ui-text-base)",
            lineHeight: "var(--neeto-ui-line-height-relaxed)",
            color: "rgb(var(--neeto-ui-gray-600))",
            textAlign: "center"
          }}>
            Instantly get a unique, session-based webhook URL. Send any HTTP
            request to this endpoint and see it appear in the request history.
            Share it, test integrations, or debug webhooks easily.
          </p>

          {/* Endpoint URL and copy button */}
          {loading ? (
            <div style={{ padding: "var(--neeto-ui-spacing-8) 0" }}>
              <Spinner size="large" />
            </div>
          ) : error ? (
            <div style={{
              color: "rgb(var(--neeto-ui-error-600))",
              fontSize: "var(--neeto-ui-text-base)",
              padding: "var(--neeto-ui-spacing-4)",
              backgroundColor: "rgb(var(--neeto-ui-error-50))",
              borderRadius: "var(--neeto-ui-rounded)",
              border: "1px solid rgb(var(--neeto-ui-error-200))"
            }}>
              {error}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--neeto-ui-spacing-4)",
                width: "100%",
                maxWidth: 500,
                margin: "0 auto",
                marginBottom: "var(--neeto-ui-spacing-8)",
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
                    fontFamily: "var(--neeto-ui-font-mono)"
                  }}
                  aria-label="Webhook endpoint URL"
                />
              </div>
              <Tooltip
                content={copied ? "Copied!" : "Copy to clipboard"}
                position="bottom"
              >
                <Button
                  style="secondary"
                  icon={Copy}
                  onClick={handleCopyWithNotification}
                  aria-label="Copy webhook endpoint"
                  size="large"
                />
              </Tooltip>
            </div>
          )}

          {/* Enhanced cURL Examples with Accordion */}
          {url && (
            <div style={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
              <h4 style={{
                fontSize: "var(--neeto-ui-text-lg)",
                fontWeight: "var(--neeto-ui-font-semibold)",
                margin: "0 0 var(--neeto-ui-spacing-4) 0",
                textAlign: "center",
                color: "rgb(var(--neeto-ui-gray-900))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--neeto-ui-spacing-2)"
              }}>
                <Code size={20} />
                cURL Examples
              </h4>

              <Accordion>
                <Accordion.Item title="POST with JSON payload">
                  <pre
                    style={{
                      margin: 0,
                      padding: "var(--neeto-ui-spacing-4)",
                      borderRadius: "var(--neeto-ui-rounded)",
                      fontSize: "var(--neeto-ui-text-sm)",
                      lineHeight: "var(--neeto-ui-line-height-relaxed)",
                      overflow: "auto",
                      backgroundColor: "rgb(var(--neeto-ui-gray-900))",
                      color: "rgb(var(--neeto-ui-gray-100))",
                      fontFamily: "var(--neeto-ui-font-mono)",
                    }}
                  >
                    {`curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "test", "data": {"key": "value"}}'`}
                  </pre>
                </Accordion.Item>

                <Accordion.Item title="GET with query parameters">
                  <pre
                    style={{
                      margin: 0,
                      padding: "var(--neeto-ui-spacing-4)",
                      borderRadius: "var(--neeto-ui-rounded)",
                      fontSize: "var(--neeto-ui-text-sm)",
                      lineHeight: "var(--neeto-ui-line-height-relaxed)",
                      overflow: "auto",
                      backgroundColor: "rgb(var(--neeto-ui-gray-900))",
                      color: "rgb(var(--neeto-ui-gray-100))",
                      fontFamily: "var(--neeto-ui-font-mono)",
                    }}
                  >
                    {`curl -X GET "${url}?source=test&action=webhook"`}
                  </pre>
                </Accordion.Item>

                <Accordion.Item title="POST with custom headers">
                  <pre
                    style={{
                      margin: 0,
                      padding: "var(--neeto-ui-spacing-4)",
                      borderRadius: "var(--neeto-ui-rounded)",
                      fontSize: "var(--neeto-ui-text-sm)",
                      lineHeight: "var(--neeto-ui-line-height-relaxed)",
                      overflow: "auto",
                      backgroundColor: "rgb(var(--neeto-ui-gray-900))",
                      color: "rgb(var(--neeto-ui-gray-100))",
                      fontFamily: "var(--neeto-ui-font-mono)",
                    }}
                  >
                    {`curl -X POST "${url}" \\
  -H "Authorization: Bearer your-token" \\
  -H "X-Webhook-Source: your-app" \\
  -d '{"timestamp": "${new Date().toISOString()}"}'`}
                  </pre>
                </Accordion.Item>

                <Accordion.Item title="PUT request">
                  <pre
                    style={{
                      margin: 0,
                      padding: "var(--neeto-ui-spacing-4)",
                      borderRadius: "var(--neeto-ui-rounded)",
                      fontSize: "var(--neeto-ui-text-sm)",
                      lineHeight: "var(--neeto-ui-line-height-relaxed)",
                      overflow: "auto",
                      backgroundColor: "rgb(var(--neeto-ui-gray-900))",
                      color: "rgb(var(--neeto-ui-gray-100))",
                      fontFamily: "var(--neeto-ui-font-mono)",
                    }}
                  >
                    {`curl -X PUT "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"updated_at": "${new Date().toISOString()}"}'`}
                  </pre>
                </Accordion.Item>
              </Accordion>
            </div>
          )}
        </div>

        {/* Right: Request history with enhanced NoData */}
        <div
          style={{
            flex: 1,
            minWidth: 600,
            display: "flex",
            flexDirection: "column",
            borderRadius: "var(--neeto-ui-rounded-lg)",
            padding: "var(--neeto-ui-spacing-8) var(--neeto-ui-spacing-6)",
            maxHeight: "calc(100vh - 200px)",
            backgroundColor: "rgb(var(--neeto-ui-white))",
            border: "1px solid rgb(var(--neeto-ui-gray-300))",
            color: "rgb(var(--neeto-ui-gray-800))",
            transition: "all 0.2s ease",
            boxShadow: "var(--neeto-ui-shadow-md)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--neeto-ui-spacing-6)",
              flexShrink: 0,
            }}
          >
            <h3 style={{
              margin: 0,
              fontSize: "var(--neeto-ui-text-xl)",
              fontWeight: "var(--neeto-ui-font-semibold)",
              color: "rgb(var(--neeto-ui-gray-900))"
            }}>
              Request History
            </h3>
            <div style={{ display: "flex", gap: "var(--neeto-ui-spacing-3)" }}>
              <Button
                label="Export Data"
                style="secondary"
                size="small"
                onClick={handleExportPDF}
                disabled={payloads.length === 0}
              />
              <Button
                label="Refresh"
                style="secondary"
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Spinner />
              </div>
            ) : payloads.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                  padding: "3rem",
                }}
              >
                <NoData
                  title="No requests yet"
                  description="Send a request to your endpoint to see it appear here"
                  image={
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "rgb(var(--neeto-ui-primary-100))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem"
                    }}>
                      <Code size={40} color="rgb(var(--neeto-ui-primary-500))" />
                    </div>
                  }
                />
              </div>
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
                    style={{
                      marginBottom: "var(--neeto-ui-spacing-5)",
                      padding: "var(--neeto-ui-spacing-5)",
                      borderRadius: "var(--neeto-ui-rounded-lg)",
                      fontSize: "var(--neeto-ui-text-sm)",
                      transition: "all 0.2s ease",
                      backgroundColor: "rgb(var(--neeto-ui-white))",
                      border: "1px solid rgb(var(--neeto-ui-gray-300))",
                      boxShadow: "var(--neeto-ui-shadow-sm)",
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
