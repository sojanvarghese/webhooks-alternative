import React from "react";
import { Button } from "@bigbinary/neetoui";
import {
  Sun,
  Moon,
  Flash,
  ActivityLog,
  Settings,
} from "@bigbinary/neeto-icons";
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
        className="landing-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem", // Reduced padding from 1.5rem 2rem
          margin: "0 auto", // Center the header
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
          <NeetoWebhooksLogo size={33} showText={true} />
        </div>
        <Button
          style="text"
          icon={darkMode ? Sun : Moon}
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          size="small"
          className="dark-mode-toggle"
        />
      </header>

      {/* Hero Section */}
      <main
        className="landing-hero"
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
          {/* Enhanced Hero Typography */}
          <h1
            className="landing-hero-title"
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              lineHeight: 1.1,
              color: darkMode ? "#f9fafb" : "#111827",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Test webhooks{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              instantly
            </span>{" "}
            with real-time monitoring
          </h1>

          {/* Enhanced Hero Description */}
          <p
            className="landing-hero-subtitle"
            style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              color: darkMode ? "#d1d5db" : "#6b7280",
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
              textAlign: "center",
            }}
          >
            Get a unique webhook URL in seconds. Send requests, monitor
            payloads, and debug integrations with our beautiful, real-time
            interface.
          </p>

          {/* Enhanced CTA Button */}
          <Button
            label="Start Testing Now"
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
              boxShadow: "0 4px 12px rgba(1, 83, 31, 0.15)",
              transition: "all 0.2s ease",
              backgroundColor: "#007a64",
              color: "white",
              border: "none",
            }}
            size="large"
          />

          {/* Enhanced Features Grid with NeetoUI icons */}
          <div
            className="landing-features"
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
            {/* Feature 1 - Enhanced with NeetoUI icon */}
            <div
              className="landing-feature-1 feature-card"
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
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "12px",
                }}
              >
                <Flash size={24} color="#22C55E" />
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                  textAlign: "center",
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
                  textAlign: "center",
                }}
              >
                Get a unique webhook endpoint immediately and start testing in
                seconds.
              </p>
            </div>

            {/* Feature 2 - Enhanced with NeetoUI icon */}
            <div
              className="landing-feature-2 feature-card"
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
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "12px",
                }}
              >
                <ActivityLog size={24} color="#3B82F6" />
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                  textAlign: "center",
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
                  textAlign: "center",
                }}
              >
                Watch requests arrive in real-time with detailed payload
                inspection.
              </p>
            </div>

            {/* Feature 3 - Enhanced with NeetoUI icon */}
            <div
              className="landing-feature-3 feature-card"
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
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "12px",
                }}
              >
                <Settings size={24} color="#8B5CF6" />
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: darkMode ? "#f9fafb" : "#111827",
                  lineHeight: 1.2,
                  textAlign: "center",
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
                  textAlign: "center",
                }}
              >
                Perfect for debugging webhooks and testing API integrations.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer
        className="landing-footer"
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          backgroundColor: darkMode
            ? "rgba(17, 24, 39, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          padding: "1rem 1.5rem", // Reduced padding from 1.5rem 2rem
          margin: "0 auto", // Center the header
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: darkMode ? "#9ca3af" : "#6b7280",
            margin: 0,
            textAlign: "center",
          }}
        >
          Built with ❤️ using NeetoUI • A simple webhook testing tool
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
