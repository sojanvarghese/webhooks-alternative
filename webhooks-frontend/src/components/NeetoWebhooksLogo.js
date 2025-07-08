import React from "react";

const NeetoWebhooksLogo = ({ size = "default" }) => {
  const dimensions = {
    small: { width: 140, height: 32, fontSize: 14 },
    default: { width: 200, height: 44, fontSize: 20 },
    large: { width: 240, height: 54, fontSize: 26 },
  };

  const { width, height, fontSize } = dimensions[size];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: width,
        height: height,
      }}
    >
      {/* Icon - Webhook symbol with green Neeto style */}
      <div
        style={{
          width: height * 1.5, // Increased width
          height: height * 0.75,
          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 2px 8px rgba(34, 197, 94, 0.18)",
        }}
      >
        {/* Webhook icon - simplified hook/arrow design */}
        <svg
          width={height * 0.7}
          height={height * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L15.5 8H8.5L12 2Z" fill="#fff" fillOpacity="0.95" />
          <path
            d="M7 10C7 8.89543 7.89543 8 9 8H15C16.1046 8 17 8.89543 17 10V14C17 15.1046 16.1046 16 15 16H13L10 22L7 16H9C7.89543 16 7 15.1046 7 14V10Z"
            fill="#fff"
            fillOpacity="0.95"
          />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
      </div>

      {/* Text - Neeto brand typography */}
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: fontSize,
            fontWeight: 700,
            color: "var(--neeto-ui-gray-900)",
            letterSpacing: "-0.025em",
          }}
        >
          NeetoWebhooks
        </span>
      </div>
    </div>
  );
};

export default NeetoWebhooksLogo;
