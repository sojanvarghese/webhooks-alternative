#!/usr/bin/env node

/**
 * Main server entry point for NeetoDeploy
 * This file serves the React frontend and proxies API requests to the Rails backend
 */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { spawn } = require("child_process");
const path = require("path");

// Environment configuration
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "production";

console.log("🚀 Starting Webhooks Application...");
console.log(`📦 Environment: ${NODE_ENV}`);
console.log(`🌐 Frontend Port: ${PORT}`);
console.log(`🔧 Backend Port: ${BACKEND_PORT}`);

// Create Express app
const app = express();

// Function to spawn a process with proper logging
function spawnProcess(command, args, options = {}) {
  const process = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    ...options,
  });

  process.on("error", (error) => {
    console.error(`❌ Error in ${command}:`, error);
  });

  process.on("exit", (code) => {
    console.log(`🔄 ${command} exited with code ${code}`);
  });

  return process;
}

// Start backend Rails server
console.log("🔧 Starting Rails backend...");
const backendProcess = spawnProcess(
  "bundle",
  ["exec", "rails", "server", "-p", BACKEND_PORT, "-b", "0.0.0.0"],
  {
    cwd: path.join(__dirname, "webhooks-backend"),
  }
);

// Wait for backend to start
setTimeout(() => {
  console.log("🌐 Setting up frontend server and API proxy...");

  // Proxy API requests to Rails backend
  // Handle webhook endpoints (UUID patterns)
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // Remove /api prefix when forwarding to backend
      },
    })
  );

  // Handle direct UUID webhook endpoints
  app.use(
    /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
    })
  );

  // Health check endpoint
  app.use(
    "/up",
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
    })
  );

  // Serve static files from React build
  app.use(express.static(path.join(__dirname, "webhooks-frontend/build")));

  // Handle React Router - serve index.html for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "webhooks-frontend/build/index.html"));
  });

  // Start the main server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎉 Application running on port ${PORT}`);
    console.log(`📡 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 Backend API: http://localhost:${BACKEND_PORT}`);
  });
}, 3000);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("📤 Received SIGTERM, shutting down gracefully...");
  backendProcess.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📤 Received SIGINT, shutting down gracefully...");
  backendProcess.kill("SIGINT");
  process.exit(0);
});

// Keep the main process alive
process.on("exit", () => {
  console.log("👋 Main process exiting...");
});
