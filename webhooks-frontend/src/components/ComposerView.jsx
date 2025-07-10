import React from "react";
import { Button, Select, Input, Textarea, Callout } from "@bigbinary/neetoui";
import { CheckCircle, CloseCircle, Send } from "@bigbinary/neeto-icons";
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
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "var(--neeto-ui-spacing-8) var(--neeto-ui-spacing-6)" }}>
      <div
        style={{
          borderRadius: "var(--neeto-ui-rounded-lg)",
          padding: "var(--neeto-ui-spacing-8)",
          backgroundColor: "rgb(var(--neeto-ui-white))",
          border: "1px solid rgb(var(--neeto-ui-gray-300))",
          color: "rgb(var(--neeto-ui-gray-800))",
          transition: "all 0.2s ease",
          boxShadow: "var(--neeto-ui-shadow-md)",
        }}
      >
        <h3 style={{
          margin: "0 0 var(--neeto-ui-spacing-4) 0",
          fontSize: "var(--neeto-ui-text-xl)",
          fontWeight: "var(--neeto-ui-font-semibold)",
          color: "rgb(var(--neeto-ui-gray-900))"
        }}>
          Request Composer
        </h3>
        <p style={{
          margin: "0 0 var(--neeto-ui-spacing-6) 0",
          fontSize: "var(--neeto-ui-text-base)",
          lineHeight: "var(--neeto-ui-line-height-relaxed)",
          color: "rgb(var(--neeto-ui-gray-600))"
        }}>
          Compose and send HTTP requests to any destination. Test your
          webhooks, APIs, or third-party integrations.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "var(--neeto-ui-spacing-8)",
            marginBottom: "var(--neeto-ui-spacing-8)",
          }}
        >
          {/* Left: Request configuration */}
          <div>
            <div style={{ marginBottom: "var(--neeto-ui-spacing-6)" }}>
              <label style={{
                display: "block",
                fontSize: "var(--neeto-ui-text-sm)",
                fontWeight: "var(--neeto-ui-font-medium)",
                margin: "0 0 var(--neeto-ui-spacing-3) 0",
                color: "rgb(var(--neeto-ui-gray-700))"
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

            <div style={{ marginBottom: "var(--neeto-ui-spacing-6)" }}>
              <label style={{
                display: "block",
                fontSize: "var(--neeto-ui-text-sm)",
                fontWeight: "var(--neeto-ui-font-medium)",
                margin: "0 0 var(--neeto-ui-spacing-3) 0",
                color: "rgb(var(--neeto-ui-gray-700))"
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
                style="primary"
                loading={composerSending}
                onClick={handleSendComposerRequest}
                disabled={composerSending || !composerUrl.trim()}
                className="composer-send-button"
                icon={Send}
                fullWidth
                size="large"
              />
            </div>
          </div>

          {/* Right: Request body */}
          <div>
            <label style={{
              display: "block",
              fontSize: "var(--neeto-ui-text-sm)",
              fontWeight: "var(--neeto-ui-font-medium)",
              margin: "0 0 var(--neeto-ui-spacing-3) 0",
              color: "rgb(var(--neeto-ui-gray-700))"
            }}>
              Request Body (JSON)
            </label>
            <Textarea
              value={composerPayload}
              onChange={(e) => setComposerPayload(e.target.value)}
              placeholder='{"message": "Hello World", "timestamp": "2025-01-08T12:00:00Z"}'
              rows={12}
              style={{
                fontFamily: "var(--neeto-ui-font-mono)",
                fontSize: "var(--neeto-ui-text-sm)",
                lineHeight: "var(--neeto-ui-line-height-relaxed)",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Enhanced Response section with Callout */}
        {composerResponse && (
          <div
            style={{
              marginTop: "var(--neeto-ui-spacing-8)",
              borderRadius: "var(--neeto-ui-rounded-lg)",
              padding: "var(--neeto-ui-spacing-6)",
              backgroundColor: "rgb(var(--neeto-ui-white))",
              border: "1px solid rgb(var(--neeto-ui-gray-300))",
              boxShadow: "var(--neeto-ui-shadow-sm)",
            }}
          >
            <h4 style={{
              margin: "0 0 var(--neeto-ui-spacing-4) 0",
              fontSize: "var(--neeto-ui-text-lg)",
              fontWeight: "var(--neeto-ui-font-semibold)",
              color: "rgb(var(--neeto-ui-gray-900))"
            }}>
              Response
            </h4>

            <Callout
              icon={composerResponse.success ? CheckCircle : CloseCircle}
              style={composerResponse.success ? "success" : "error"}
              className="mb-6"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--neeto-ui-spacing-4)" }}>
                <span style={{
                  fontSize: "var(--neeto-ui-text-sm)",
                  fontWeight: "var(--neeto-ui-font-semibold)"
                }}>
                  {composerResponse.success ? "Request Successful" : "Request Failed"}
                </span>
                {composerResponse.status && (
                  <span style={{
                    fontSize: "var(--neeto-ui-text-sm)",
                    fontWeight: "var(--neeto-ui-font-medium)"
                  }}>
                    Status: {composerResponse.status}
                  </span>
                )}
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    fontSize: "var(--neeto-ui-text-xs)",
                    color: "rgb(var(--neeto-ui-gray-500))"
                  }}>
                    {new Date(composerResponse.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </Callout>

            {composerResponse.data && (
              <div style={{ marginBottom: "var(--neeto-ui-spacing-6)" }}>
                <p style={{
                  fontSize: "var(--neeto-ui-text-sm)",
                  fontWeight: "var(--neeto-ui-font-medium)",
                  margin: "0 0 var(--neeto-ui-spacing-3) 0",
                  color: "rgb(var(--neeto-ui-gray-700))"
                }}>
                  Response Body:
                </p>
                <div style={{
                  maxHeight: 250,
                  overflow: "auto",
                  border: "1px solid rgb(var(--neeto-ui-gray-300))",
                  borderRadius: "var(--neeto-ui-rounded)",
                  padding: "var(--neeto-ui-spacing-4)"
                }}>
                  <JsonViewer data={composerResponse.data} />
                </div>
              </div>
            )}

            {composerResponse.headers && (
              <div style={{ marginBottom: "var(--neeto-ui-spacing-6)" }}>
                <p style={{
                  fontSize: "var(--neeto-ui-text-sm)",
                  fontWeight: "var(--neeto-ui-font-medium)",
                  margin: "0 0 var(--neeto-ui-spacing-3) 0",
                  color: "rgb(var(--neeto-ui-gray-700))"
                }}>
                  Response Headers:
                </p>
                <div
                  style={{
                    maxHeight: 180,
                    overflow: "auto",
                    fontSize: "var(--neeto-ui-text-sm)",
                    fontFamily: "var(--neeto-ui-font-mono)",
                    backgroundColor: "rgb(var(--neeto-ui-gray-50))",
                    padding: "var(--neeto-ui-spacing-4)",
                    borderRadius: "var(--neeto-ui-rounded)",
                    border: "1px solid rgb(var(--neeto-ui-gray-300))",
                    lineHeight: "var(--neeto-ui-line-height-relaxed)",
                  }}
                >
                  {Object.entries(composerResponse.headers).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: "var(--neeto-ui-spacing-1)" }}>
                      <span style={{ fontWeight: "var(--neeto-ui-font-semibold)", color: "rgb(var(--neeto-ui-gray-600))" }}>{key}:</span>{" "}
                      <span style={{ color: "rgb(var(--neeto-ui-gray-800))" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {composerResponse.error && (
              <div style={{ marginTop: "var(--neeto-ui-spacing-6)" }}>
                <p style={{
                  fontSize: "var(--neeto-ui-text-sm)",
                  fontWeight: "var(--neeto-ui-font-medium)",
                  margin: "0 0 var(--neeto-ui-spacing-3) 0",
                  color: "rgb(var(--neeto-ui-gray-700))"
                }}>
                  Error Details:
                </p>
                <pre
                  style={{
                    margin: 0,
                    padding: "var(--neeto-ui-spacing-4)",
                    borderRadius: "var(--neeto-ui-rounded)",
                    fontSize: "var(--neeto-ui-text-sm)",
                    color: "rgb(var(--neeto-ui-error-600))",
                    backgroundColor: "rgb(var(--neeto-ui-error-50))",
                    border: "1px solid rgb(var(--neeto-ui-error-200))",
                    fontFamily: "var(--neeto-ui-font-mono)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    lineHeight: "var(--neeto-ui-line-height-relaxed)",
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
