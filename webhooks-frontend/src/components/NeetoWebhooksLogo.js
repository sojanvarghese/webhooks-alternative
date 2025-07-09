import React from "react";

// NeetoWebhooksLogo component renders the logo with a webhook-themed SVG and brand text
const NeetoWebhooksLogo = ({ size = "default" }) => {
  // Size configurations for different logo sizes
  const sizes = {
    small: { width: "120", height: "30", textClass: "text-sm" },
    default: { width: "200", height: "50", textClass: "text-base" },
    large: { width: "280", height: "70", textClass: "text-lg" },
  };

  // Get width and height based on the size prop
  const { width, height } = sizes[size] || sizes.default;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* SVG icon representing webhook connections */}
      <svg
        width={32}
        height={32}
        viewBox="0 0 45 45"
        fill="none"
        className="flex-shrink-0"
      >
        {/* Background shapes representing webhook connections */}
        {/* Main webhook node (center) */}
        <rect x="15" y="15" width="15" height="15" rx="3" fill="#5BCC5A" />
        {/* Connection lines/paths */}
        <path
          d="M8 8 L15 15 M30 15 L37 8 M15 30 L8 37 M30 30 L37 37"
          stroke="#75DC66"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Endpoint nodes */}
        <circle cx="8" cy="8" r="4" fill="#0DA84C" />
        <circle cx="37" cy="8" r="4" fill="#0DA84C" />
        <circle cx="8" cy="37" r="4" fill="#0DA84C" />
        <circle cx="37" cy="37" r="4" fill="#0DA84C" />
        {/* Data flow indicators (small dots) */}
        <circle cx="12" cy="12" r="1.5" fill="#22C55E" />
        <circle cx="33" cy="12" r="1.5" fill="#22C55E" />
        <circle cx="12" cy="33" r="1.5" fill="#22C55E" />
        <circle cx="33" cy="33" r="1.5" fill="#22C55E" />
      </svg>
      {/* Brand text for NeetoWebhooks */}
      <span
        style={{
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--neeto-ui-gray-900)",
          letterSpacing: "-0.025em",
        }}
      >
        NeetoWebhooks
      </span>
    </div>
  );
};

export default NeetoWebhooksLogo;
