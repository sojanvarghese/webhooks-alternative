import React from "react";
import { Button, Typography } from "@bigbinary/neetoui";
import { Sun, Moon } from "@bigbinary/neeto-icons";
import NeetoWebhooksLogo from "./NeetoWebhooksLogo";

const LandingPage = ({ onStartTesting, darkMode, toggleDarkMode }) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header
        className="app-header"
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NeetoWebhooksLogo size="default" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Dark mode toggle button in header */}
          <Button
            variant="text"
            icon={darkMode ? Sun : Moon}
            onClick={toggleDarkMode}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            size="large"
          />
          <Button
            variant="primary"
            label="Start Testing"
            onClick={onStartTesting}
            className="gradient-primary-button"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1
            className="text-primary"
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              lineHeight: 1.2,
            }}
          >
            Test webhooks{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--method-get), var(--method-post))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              instantly
            </span>{" "}
            with session-based URLs
          </h1>
          <p
            className="text-secondary"
            style={{
              fontSize: "1.3rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Get a unique webhook endpoint instantly. Send HTTP requests, inspect
            payloads, headers, and debug webhooks in real-time. No signup
            required.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              size="large"
              label="Start Testing Now"
              onClick={onStartTesting}
              className="gradient-primary-button hero-button"
              style={{ fontSize: "1.1rem", padding: "12px 32px" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="text-primary"
              style={{ fontSize: "2.5rem", fontWeight: 700 }}
            >
              Instant
            </div>
            <div className="text-secondary" style={{ fontSize: "1rem" }}>
              Setup time
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              className="text-primary"
              style={{ fontSize: "2.5rem", fontWeight: 700 }}
            >
              100%
            </div>
            <div className="text-secondary" style={{ fontSize: "1rem" }}>
              Free to use
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              className="text-primary"
              style={{ fontSize: "2.5rem", fontWeight: 700 }}
            >
              Real-time
            </div>
            <div className="text-secondary" style={{ fontSize: "1rem" }}>
              Request inspection
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{ padding: "4rem 2rem", background: "var(--bg-tertiary)" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            className="text-primary"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Everything you need for webhook testing
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            {/* Feature 1 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Instant Setup
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Get a unique webhook URL instantly. No registration, no
                configuration. Just start testing your webhooks immediately.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Deep Inspection
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                View complete request details including headers, payload, IP
                address, user agent, and query parameters.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Real-time Updates
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                See incoming requests instantly. Perfect for debugging webhooks
                and testing integrations in real-time.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Request Composer
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Send HTTP requests to any endpoint. Test your own webhooks and
                APIs with our built-in request composer.
              </p>
            </div>

            {/* Feature 5 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Data Export
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Export webhook data with detailed statistics, request counts by
                method, and comprehensive reports.
              </p>
            </div>

            {/* Feature 6 */}
            <div
              className="app-card"
              style={{ padding: "2rem", borderRadius: 12, textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌙</div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Dark Mode
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Switch between light and dark themes for comfortable testing in
                any environment. Preferences are saved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2
            className="text-primary"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "3rem",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "var(--method-get)",
                  color: "white",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: "0 auto 1rem",
                }}
              >
                1
              </div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Get Your URL
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Click "Start Testing" to get a unique webhook URL instantly. No
                signup required.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "var(--method-post)",
                  color: "white",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: "0 auto 1rem",
                }}
              >
                2
              </div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Send Requests
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                Use curl, Postman, or any tool to send HTTP requests to your
                endpoint.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "var(--method-put)",
                  color: "white",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: "0 auto 1rem",
                }}
              >
                3
              </div>
              <h3
                className="text-primary"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Inspect & Debug
              </h3>
              <p className="text-secondary" style={{ lineHeight: 1.6 }}>
                View real-time request details, headers, payloads, and export
                data for analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 2rem",
          background: "var(--bg-tertiary)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            className="text-primary"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            Ready to test your webhooks?
          </h2>
          <p
            className="text-secondary"
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Get started instantly with NeetoWebhooks. No signup, no
            configuration, just instant webhook testing.
          </p>
          <Button
            variant="primary"
            size="large"
            label="Start Testing Now"
            onClick={onStartTesting}
            className="gradient-primary-button cta-button"
            style={{ fontSize: "1.1rem", padding: "12px 32px" }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
          Inspired by{" "}
          <a
            href="https://webhook.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Webhook.site
          </a>
          . Built with ❤️ for developers who need reliable webhook testing.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
