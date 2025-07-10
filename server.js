#!/usr/bin/env node

/**
 * Main server entry point for NeetoDeploy
 * This file serves the React frontend and proxies API requests to the Rails backend
 */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Environment configuration
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "production";

console.log("🚀 Starting Webhooks Application...");
console.log(`📦 Environment: ${NODE_ENV}`);
console.log(`🌐 Frontend Port: ${PORT}`);
console.log(`🔧 Backend Port: ${BACKEND_PORT}`);

// Validate that build directory exists
const buildPath = path.join(__dirname, "webhooks-frontend/build");
if (!fs.existsSync(buildPath)) {
  console.error("❌ Frontend build directory not found at:", buildPath);
  console.error("❌ Please run 'yarn build' first");
  process.exit(1);
}

// Create Express app
const app = express();

// DO NOT use app.use(express.json()) here as it consumes the request body
// before it can be proxied to the Rails backend. Only use JSON parsing
// for specific routes that need it, not for proxy routes.

// Function to spawn a process with proper logging
function spawnProcess(command, args, options = {}) {
  console.log(`🔧 Starting: ${command} ${args.join(" ")}`);

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
    if (code !== 0) {
      console.error(`❌ ${command} failed with exit code ${code}`);
    }
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
    env: { ...process.env, RAILS_ENV: "production" },
  }
);

// Wait for backend to start
setTimeout(() => {
  console.log("🌐 Setting up frontend server and API proxy...");

  // IMPORTANT: Define proxy routes FIRST, before static file serving
  // This ensures that proxy routes are matched before the catch-all React route

  // Health check proxy
  app.use(
    "/up",
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error("❌ Health check proxy error:", err.message);
        res.status(502).json({ error: "Backend unavailable" });
      },
    })
  );

  // API proxy - handles API routes
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // Remove /api prefix when forwarding to backend
      },
      onError: (err, req, res) => {
        console.error("❌ API proxy error:", err.message);
        res.status(502).json({ error: "Backend API unavailable" });
      },
    })
  );

  // Webhook endpoints proxy - handles UUID patterns directly
  app.use(
    /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    createProxyMiddleware({
      target: `http://localhost:${BACKEND_PORT}`,
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error("❌ Webhook proxy error:", err.message);
        res.status(502).json({ error: "Webhook backend unavailable" });
      },
    })
  );

  // ONLY AFTER defining proxies, serve static files and catch-all React route

  // Serve static files from React build
  app.use(express.static(buildPath));

  // Handle React Router - serve index.html for all other routes
  // This MUST be last, as it's the catch-all route
  app.get("*", (req, res) => {
    const indexPath = path.join(buildPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error("❌ index.html not found at:", indexPath);
      res.status(500).send("Frontend not properly built");
    }
  });

  // Start the main server
  app
    .listen(PORT, "0.0.0.0", () => {
      console.log(`🎉 Application running on port ${PORT}`);
      console.log(`📡 Frontend: http://localhost:${PORT}`);
      console.log(`🔧 Backend API: http://localhost:${BACKEND_PORT}`);
      console.log(`📁 Serving static files from: ${buildPath}`);
    })
    .on("error", (err) => {
      console.error("❌ Failed to start server:", err.message);
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
}, 5000); // Increased wait time for backend startup

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("📤 Received SIGTERM, shutting down gracefully...");
  if (backendProcess) {
    backendProcess.kill("SIGTERM");
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📤 Received SIGINT, shutting down gracefully...");
  if (backendProcess) {
    backendProcess.kill("SIGINT");
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Keep the main process alive
process.on("exit", () => {
  console.log("👋 Main process exiting...");
});
