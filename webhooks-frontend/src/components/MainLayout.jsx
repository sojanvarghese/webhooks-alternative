import React, { useState } from "react";
import { Button } from "@bigbinary/neetoui";
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#1f2937",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 1.5rem 2rem 1.5rem",
            borderBottom: "1px solid #374151",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Sidebar logo: icon only, no text */}
            <NeetoWebhooksLogo size={32} showText={false} />
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              NeetoWebhooks
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0 1rem" }}>
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                activeTab === "dashboard" ? "#059669" : "transparent",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => setActiveTab("dashboard")}
            onMouseEnter={(e) => {
              if (activeTab !== "dashboard") {
                e.target.style.backgroundColor = "#374151";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "dashboard") {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            Dashboard
          </button>

          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                activeTab === "composer" ? "#059669" : "transparent",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => setActiveTab("composer")}
            onMouseEnter={(e) => {
              if (activeTab !== "composer") {
                e.target.style.backgroundColor = "#374151";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "composer") {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            Request Composer
          </button>
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #374151",
            fontSize: "0.75rem",
            color: "#9ca3af",
          }}
        >
          Neeto Webhooks
          <br />
          v1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem", // Reduced padding from 1rem 2rem
            borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            color: darkMode ? "#f9fafb" : "#111827",
            transition: "all 0.2s ease",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
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
                margin: "0.25rem 0 0 0",
                fontSize: "0.875rem",
                color: darkMode ? "#d1d5db" : "#6b7280",
              }}
            >
              {activeTab === "dashboard"
                ? "Monitor incoming webhook requests in real-time"
                : "Send custom HTTP requests to test endpoints"}
            </p>
          </div>

          {/* Smaller Dark Mode Toggle */}
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

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: darkMode ? "#111827" : "#f9fafb",
          color: darkMode ? "#f9fafb" : "#111827",
          transition: "all 0.2s ease",
        }}>
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
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
