import React, { useState } from "react";
import { Button, Tab } from "@bigbinary/neetoui";
import { Sun, Moon } from "@bigbinary/neeto-icons";
import NeetoWebhooksLogo from "./NeetoWebhooksLogo";
import DashboardView from "./DashboardView";
import ComposerView from "./ComposerView";

const MainLayout = ({
  darkMode,
  toggleDarkMode,
  // Dashboard props
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
  // Composer props
  composerMethod,
  setComposerMethod,
  composerUrl,
  setComposerUrl,
  composerPayload,
  setComposerPayload,
  composerSending,
  handleSendComposerRequest,
  composerResponse,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header with logo, tabs, and dark mode toggle */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease",
        }}
      >
        {/* Left side: Logo and brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <NeetoWebhooksLogo size={32} showText={false} />
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: darkMode ? "#f9fafb" : "#111827",
              }}
            >
              NeetoWebhooks
            </span>
          </div>

          {/* Navigation tabs */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tab
              style={{
                "--neeto-ui-tab-active-color": "rgb(var(--neeto-ui-primary-500))",
                "--neeto-ui-tab-active-border-color": "rgb(var(--neeto-ui-primary-500))",
              }}
            >
              <Tab.Item
                id="dashboard"
                label="Dashboard"
                onClick={() => setActiveTab("dashboard")}
                active={activeTab === "dashboard"}
              />
              <Tab.Item
                id="composer"
                label="Request Composer"
                onClick={() => setActiveTab("composer")}
                active={activeTab === "composer"}
              />
            </Tab>
          </div>
        </div>

        {/* Right side: Dark mode toggle */}
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
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "6px",
          }}
        />
      </header>

      {/* Sub-header with title and description */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          backgroundColor: darkMode ? "#111827" : "#f9fafb",
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease",
        }}
      >
        <h1
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: darkMode ? "#f9fafb" : "#111827",
          }}
        >
          {activeTab === "dashboard"
            ? "Webhook Dashboard"
            : "Request Composer"}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: darkMode ? "#d1d5db" : "#6b7280",
            lineHeight: 1.5,
          }}
        >
          {activeTab === "dashboard"
            ? "Monitor incoming webhook requests in real-time"
            : "Send custom HTTP requests to test endpoints"}
        </p>
      </div>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: darkMode ? "#111827" : "#f9fafb",
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease",
        }}
      >
        {activeTab === "dashboard" ? (
          <DashboardView
            loading={loading}
            error={error}
            url={url}
            copied={copied}
            handleCopy={handleCopy}
            payloads={payloads}
            fetchingPayloads={fetchingPayloads}
            handleExportPDF={handleExportPDF}
            fetchPayloads={fetchPayloads}
            getMethodColor={getMethodColor}
            darkMode={darkMode}
          />
        ) : (
          <ComposerView
            composerMethod={composerMethod}
            setComposerMethod={setComposerMethod}
            composerUrl={composerUrl}
            setComposerUrl={setComposerUrl}
            composerPayload={composerPayload}
            setComposerPayload={setComposerPayload}
            composerSending={composerSending}
            handleSendComposerRequest={handleSendComposerRequest}
            composerResponse={composerResponse}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem 2rem",
          borderTop: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#9ca3af" : "#6b7280",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        NeetoWebhooks v1.0.0 • Built with ❤️ using NeetoUI
      </footer>
    </div>
  );
};

export default MainLayout;
