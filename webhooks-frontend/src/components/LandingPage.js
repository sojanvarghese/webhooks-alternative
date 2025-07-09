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
          <NeetoWebhooksLogo size={36} />
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          >
            NeetoWebhooks
          </span>
        </div>

        {/* Smaller Dark Mode Toggle aligned with Start Testing button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            label="Start Testing"
            variant="primary"
            onClick={onStartTesting}
            className="gradient-primary-button"
            size="large"
            style={{
              height: "2.75rem",
              padding: "0 1.5rem",
            }}
          />
          <Button
            variant="text"
            icon={darkMode ? Sun : Moon}
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            size="small"
            style={{
              padding: "0.5rem",
              minWidth: "auto",
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "6px",
              backgroundColor: darkMode
                ? "rgba(55, 65, 81, 0.5)"
                : "rgba(243, 244, 246, 0.5)",
              border: `1px solid ${darkMode ? "#4b5563" : "#d1d5db"}`,
            }}
          />
        </div>
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

          {/* CTA Button */}
          <Button
            label="Start Testing Now"
            variant="primary"
            size="large"
            onClick={onStartTesting}
            className="gradient-primary-button"
            style={{
              fontSize: "1.125rem",
              padding: "1rem 2rem",
              height: "auto",
              marginBottom: "4rem",
            }}
          />

          {/* Features Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              marginTop: "4rem",
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                padding: "2rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.6)"
                  : "rgba(255, 255, 255, 0.8)",
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  color: "#059669",
                }}
              >
                ⚡
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              >
                Instant Setup
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                }}
              >
                No registration required. Get a unique webhook endpoint
                immediately and start testing in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                padding: "2rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.6)"
                  : "rgba(255, 255, 255, 0.8)",
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  color: "#2563eb",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              >
                Real-time Monitoring
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                }}
              >
                Watch requests arrive in real-time with detailed payload
                inspection and beautiful JSON visualization.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                padding: "2rem",
                borderRadius: "12px",
                backgroundColor: darkMode
                  ? "rgba(31, 41, 55, 0.6)"
                  : "rgba(255, 255, 255, 0.8)",
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  color: "#7c3aed",
                }}
              >
                🔧
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              >
                Debug & Test
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: darkMode ? "#d1d5db" : "#6b7280",
                }}
              >
                Perfect for debugging webhooks, testing integrations, and
                validating API payloads during development.
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
