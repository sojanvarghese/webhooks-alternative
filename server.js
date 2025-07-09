#!/usr/bin/env node

/**
 * Main server entry point for NeetoDeploy
 * This file orchestrates both the React frontend (served as static files)
 * and Rails backend API for the webhooks application
 */

const { spawn } = require("child_process");
const path = require("path");

// Environment configuration
const FRONTEND_PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "production";

console.log("🚀 Starting Webhooks Application...");
console.log(`📦 Environment: ${NODE_ENV}`);
console.log(`🌐 Frontend Port: ${FRONTEND_PORT}`);
console.log(`🔧 Backend Port: ${BACKEND_PORT}`);

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

// Start frontend (build and serve static files)
console.log("🌐 Building and starting React frontend...");
const frontendProcess = spawnProcess("npm", ["run", "start:frontend"], {
  env: { ...process.env, PORT: FRONTEND_PORT },
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("📤 Received SIGTERM, shutting down gracefully...");
  backendProcess.kill("SIGTERM");
  frontendProcess.kill("SIGTERM");
});

process.on("SIGINT", () => {
  console.log("📤 Received SIGINT, shutting down gracefully...");
  backendProcess.kill("SIGINT");
  frontendProcess.kill("SIGINT");
});

// Keep the main process alive
process.on("exit", () => {
  console.log("👋 Main process exiting...");
});
