import React from "react";
import { Button, Select, Input, Textarea } from "@bigbinary/neetoui";
import JsonViewer from "./JsonViewer";

const ComposerView = ({
  composerMethod,
  setComposerMethod,
  composerUrl,
  setComposerUrl,
  composerPayload,
  setComposerPayload,
  composerSending,
  handleSendComposerRequest,
  composerResponse,
  darkMode,
}) => {
  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div
        className="app-card composer-card"
        style={{
          borderRadius: 12,
          padding: "2rem",
          backgroundColor: darkMode ? "#1f2937" : "#fff",
          border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease",
        }}
      >
        <h3 style={{
          margin: "0 0 1rem 0",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: darkMode ? "#f9fafb" : "#111827"
        }}>
          Request Composer
        </h3>
        <p style={{
          margin: "0 0 1.5rem 0",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: darkMode ? "#d1d5db" : "#6b7280"
        }}>
          Compose and send HTTP requests to any destination. Test your
          webhooks, APIs, or third-party integrations.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Left: Request configuration */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                margin: "0 0 0.75rem 0",
                color: darkMode ? "#f9fafb" : "#374151"
              }}>
                HTTP Method
              </label>
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
                size="large"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                margin: "0 0 0.75rem 0",
                color: darkMode ? "#f9fafb" : "#374151"
              }}>
                Destination URL
              </label>
              <Input
                value={composerUrl}
                onChange={(e) => setComposerUrl(e.target.value)}
                placeholder="https://api.example.com/webhook"
                style={{ width: "100%" }}
                size="large"
              />
            </div>

            <div>
              <Button
                label={composerSending ? "Sending..." : "Send Request"}
                variant="primary"
                loading={composerSending}
                onClick={handleSendComposerRequest}
                disabled={composerSending || !composerUrl.trim()}
                className="composer-send-button"
                style={{
                  width: "100%"
                }}
                size="large"
              />
            </div>
          </div>

          {/* Right: Request body */}
          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              margin: "0 0 0.75rem 0",
              color: darkMode ? "#f9fafb" : "#374151"
            }}>
              Request Body (JSON)
            </label>
            <Textarea
              value={composerPayload}
              onChange={(e) => setComposerPayload(e.target.value)}
              placeholder='{"message": "Hello World", "timestamp": "2025-01-08T12:00:00Z"}'
              rows={12}
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                lineHeight: 1.5,
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Response section */}
        {composerResponse && (
          <div
            className="app-card"
            style={{ marginTop: "2rem", borderRadius: 12, padding: "1.5rem" }}
          >
            <h4 style={{
              margin: "0 0 1rem 0",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827"
            }}>
              Response
            </h4>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                padding: "12px 16px",
                backgroundColor: composerResponse.success ? "#f0fdf4" : "#fef2f2",
                borderRadius: 8,
                border: `1px solid ${composerResponse.success ? "#bbf7d0" : "#fecaca"}`,
              }}
            >
              <span
                style={{
                  background: composerResponse.success ? "#059669" : "#dc2626",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  minWidth: "70px",
                  textAlign: "center",
                }}
              >
                {composerResponse.success ? "SUCCESS" : "ERROR"}
              </span>
              {composerResponse.status && (
                <span style={{
                  color: composerResponse.success ? "#059669" : "#dc2626",
                  fontWeight: 600,
                  fontSize: "0.875rem"
                }}>
                  Status: {composerResponse.status}
                </span>
              )}
              <div style={{ marginLeft: "auto" }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {new Date(composerResponse.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {composerResponse.data && (
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  margin: "0 0 0.75rem 0",
                  color: "#374151"
                }}>
                  Response Body:
                </p>
                <div style={{
                  maxHeight: 250,
                  overflow: "auto",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "1rem"
                }}>
                  <JsonViewer data={composerResponse.data} />
                </div>
              </div>
            )}

            {composerResponse.headers && (
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  margin: "0 0 0.75rem 0",
                  color: "#374151"
                }}>
                  Response Headers:
                </p>
                <div
                  style={{
                    maxHeight: 180,
                    overflow: "auto",
                    fontSize: 13,
                    fontFamily: "monospace",
                    backgroundColor: "#f9fafb",
                    padding: "1rem",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    lineHeight: 1.5,
                  }}
                >
                  {Object.entries(composerResponse.headers).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: "#6b7280" }}>{key}:</span>{" "}
                      <span style={{ color: "#111827" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {composerResponse.error && (
              <div style={{ marginTop: 24 }}>
                <p style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  margin: "0 0 0.75rem 0",
                  color: "#374151"
                }}>
                  Error Details:
                </p>
                <pre
                  style={{
                    margin: 0,
                    padding: "1rem",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    lineHeight: 1.5,
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
  );
};

export default ComposerView;
