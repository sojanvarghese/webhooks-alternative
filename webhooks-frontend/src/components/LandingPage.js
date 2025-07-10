import React from "react";
import { Button } from "@bigbinary/neetoui";
import { Sun, Moon } from "@bigbinary/neeto-icons";
import NeetoWebhooksLogo from "./NeetoWebhooksLogo";

const LandingPage = ({ darkMode, toggleDarkMode, onStartTesting }) => {
  return (
    <div
      className="landing-container"
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
          : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          backgroundColor: darkMode
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Logo with text for branding */}
          <NeetoWebhooksLogo size={36} showText={true} />
        </div>
        {/* Dark Mode Toggle only */}
        <Button
          variant="text"
          icon={darkMode ? Sun : Moon}
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          size="small"
          style={{
            padding: "0.5rem",
            minWidth: "auto",
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "6px",
            color: "#111827",
            border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
          }}
        />
      </header>

      {/* Hero Section */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 120px)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Hero Heading */}
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          >
            Test webhooks <span className="gradient-text">instantly</span> with
            real-time monitoring
          </h1>

          {/* Hero Description */}
          <p
            style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              marginBottom: "3rem",
              color: darkMode ? "#d1d5db" : "#6b7280",
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
            }}
          >
            Get a unique webhook URL in seconds. Send requests, monitor
            payloads, and debug integrations with our beautiful, real-time
            interface.
          </p>

          {/* CTA Button with improved Neeto styling */}
          <Button
            label="Start Testing Now"
            variant="primary"
            size="large"
            onClick={onStartTesting}
            className="landing-cta-button"
            style={{
              fontSize: "1.125rem",
              padding: "1rem 2.5rem",
              height: "auto",
              marginBottom: "4rem",
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
              transition: "all 0.2s ease",
            }}
          />

          {/* Features Grid with compact cards in a single row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              marginTop: "3rem",
              alignItems: "stretch",
              justifyContent: "center",
              maxWidth: "1000px",
              margin: "3rem auto 0 auto",
            }}
          >
            {/* Feature 1 - Compact styling */}
            <div
              style={{
                padding: "1.5rem 1rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.7)"
                  : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "200px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  color: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "12px",
                }}
              >
                ⚡
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                }}
              >
                Instant Setup
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                  margin: 0,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Get a unique webhook endpoint immediately and start testing in
                seconds.
              </p>
            </div>

            {/* Feature 2 - Compact styling */}
            <div
              style={{
                padding: "1.5rem 1rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.7)"
                  : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "200px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  color: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "12px",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                }}
              >
                Real-time Monitoring
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                  margin: 0,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Watch requests arrive in real-time with detailed payload
                inspection.
              </p>
            </div>

            {/* Feature 3 - Compact styling */}
            <div
              style={{
                padding: "1.5rem 1rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.7)"
                  : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "200px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "12px",
                }}
              >
                🔧
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                }}
              >
                Debug & Test
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                  margin: 0,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Perfect for debugging webhooks and testing API integrations.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          backgroundColor: darkMode
            ? "rgba(17, 24, 39, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: darkMode ? "#9ca3af" : "#6b7280",
            margin: 0,
          }}
        >
          Built with ❤️ using NeetoUI • A simple webhook testing tool
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
