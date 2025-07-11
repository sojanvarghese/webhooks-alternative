import React from "react";
import { Button, Select, Input, Textarea, Spinner, Tooltip, Toastr } from "@bigbinary/neetoui";
import JsonViewer from "./JsonViewer";

// Request Composer component for sending HTTP requests
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
  // Handler for sending the request and showing a success Toastr
  const handleSend = async () => {
    await handleSendComposerRequest();
    Toastr.success("Request sent successfully!");
  };

  // Options for HTTP methods
  const methodOptions = [
    { label: "POST", value: "POST" },
    { label: "GET", value: "GET" },
    { label: "PUT", value: "PUT" },
    { label: "PATCH", value: "PATCH" },
    { label: "DELETE", value: "DELETE" },
  ];

  // Custom class for Select in dark mode
  const selectClass = darkMode ? "neetoui-dark-select" : "";

  return (
    <section style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Card container for the composer */}
      <div
        className="app-card composer-card"
        style={{
          borderRadius: 12,
          padding: "2rem",
          backgroundColor: darkMode ? "#1f2937" : "#fff",
          border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease"
        }}
      >
        {/* Title and description */}
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

        {/* Form grid: Method, URL, Payload */}
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
            {/* HTTP Method Select */}
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
                options={methodOptions}
                isSearchable={false}
                size="large"
                className={selectClass}
                isDisabled={composerSending}
              />
            </div>
            {/* URL Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                margin: "0 0 0.75rem 0",
                color: darkMode ? "#f9fafb" : "#374151"
              }}>
                Request URL
              </label>
              <Input
                value={composerUrl}
                onChange={(e) => setComposerUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                size="large"
                disabled={composerSending}
                style={{ fontFamily: "monospace" }}
              />
            </div>
          </div>

          {/* Right: Payload Textarea */}
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
              placeholder={`{
  "message": "Hello World"
}`}
              rows={10}
              size="large"
              disabled={composerSending || composerMethod === "GET"}
              style={{ fontFamily: "monospace" }}
            />
          </div>
        </div>

        {/* Send Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            label={composerSending ? "Sending..." : "Send Request"}
            style="primary"
            size="medium"
            onClick={handleSend}
            disabled={composerSending || !composerUrl.trim()}
            loading={composerSending}
            className="composer-send-button"
          />
        </div>
      </div>

      {/* Response section: show after sending a request */}
      {composerSending && (
        <div
          className="app-card composer-response-card"
          style={{
            marginTop: 32,
            borderRadius: 12,
            padding: "2rem",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Spinner for response loading */}
          <Spinner size="large" color={darkMode ? "white" : "primary"} />
        </div>
      )}
      {composerResponse && !composerSending && (
        <div
          className="app-card composer-response-card"
          style={{
            marginTop: 32,
            borderRadius: 12,
            padding: "2rem",
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "all 0.2s ease",
          }}
        >
          <h4 style={{
            margin: "0 0 1rem 0",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: composerResponse.success ? "#059669" : "#dc2626"
          }}>
            {composerResponse.success ? "Response" : "Error"}
          </h4>
          {/* Show status and statusText if available */}
          {composerResponse.status && (
            <div style={{ marginBottom: 12, color: darkMode ? "#d1d5db" : "#6b7280" }}>
              <strong>Status:</strong> {composerResponse.status} {composerResponse.statusText}
            </div>
          )}
          {/* Show error message if present */}
          {composerResponse.error && (
            <div style={{ marginBottom: 12, color: "#dc2626" }}>
              <strong>Error:</strong> {composerResponse.error}
            </div>
          )}
          {/* Show response data as JSON */}
          {composerResponse.data && (
            <div style={{ marginBottom: 12 }}>
              <strong>Data:</strong>
              <JsonViewer data={composerResponse.data} />
            </div>
          )}
          {/* Show response headers if present */}
          {composerResponse.headers && Object.keys(composerResponse.headers).length > 0 && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 500, color: darkMode ? "#f9fafb" : "#374151" }}>
                Headers
              </summary>
              <div style={{ marginTop: 8, fontSize: 13, fontFamily: "monospace" }}>
                {Object.entries(composerResponse.headers).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: 4 }}>
                    <span style={{ color: "#6b7280" }}>{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
};

export default ComposerView;
