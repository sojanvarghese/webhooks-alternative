# Deployment Guide for NeetoDeploy

This document explains how to deploy the Webhooks Alternative application on NeetoDeploy.

## Overview

This is a monorepo containing:
- **Frontend**: React application (served as static files in production)
- **Backend**: Rails API server with SQLite database

## Files Added for NeetoDeploy Compatibility

### Root Level Configuration Files

1. **`package.json`** - Root package.json for Node.js buildpack detection
2. **`Gemfile`** - Root Gemfile for Ruby buildpack detection
3. **`server.js`** - Entry point for node-start buildpack (alternative to Procfile)
4. **`.buildpacks`** - Explicit buildpack specification
5. **`app.json`** - NeetoDeploy app configuration and metadata

### Updated Files

1. **`Procfile`** - Updated to use production-ready commands:
   - Frontend: Build React app and serve static files with `serve`
   - Backend: Rails server on port 3001

2. **`webhooks-frontend/src/config/api.js`** - New API configuration:
   - Handles different environments (development vs production)
   - Automatically detects NeetoDeploy URLs
   - Provides proper backend API endpoints

3. **`webhooks-frontend/src/App.js`** - Updated to use dynamic API URLs

## NeetoDeploy Configuration

### Build System
- **Type**: Buildpacks
- **Buildpacks**:
  - `neeto-deploy/nodejs`
  - `neeto-deploy/ruby`
  - `neeto-deploy/sqlite`
  - `neeto-deploy/jemalloc`

### Processes
```
backend: cd webhooks-backend && bundle exec rails server -p 3001 -b 0.0.0.0
frontend: cd webhooks-frontend && npm run build && npx serve -s build -l 3000
```

### Environment Variables
- `NODE_ENV=production`
- `RAILS_ENV=production`
- `RAILS_SERVE_STATIC_FILES=true`
- `RAILS_LOG_TO_STDOUT=true`

### Health Check
- **Path**: `/`

### Addons
- **neetodeploy-sqlite v3**: Required for webhook payload data persistence

## Deployment Process

1. **Push to Git**: Ensure all changes are committed and pushed to your Git repository

2. **Configure NeetoDeploy**:
   - Set the build system to "Buildpacks"
   - Add the specified buildpacks in order
   - Configure the processes as shown above
   - Set environment variables
   - Add neetodeploy-sqlite addon

3. **Deploy**: Trigger a deployment in NeetoDeploy

## How It Works

### Build Phase
1. NeetoDeploy detects Node.js app via root `package.json`
2. NeetoDeploy detects Ruby app via root `Gemfile`
3. SQLite buildpack provides database support
4. Installs Node.js dependencies and Ruby gems
5. Frontend builds static files via `npm run build`

### Runtime Phase
1. **Database**: SQLite database stores webhook payload data
2. **Frontend Process**: Serves built React app as static files on port 3000
3. **Backend Process**: Runs Rails API server on port 3001
4. **API Communication**: Frontend automatically detects the correct backend URL

### URL Structure
- **Frontend**: `https://your-app.neetodeployapp.com` (port 3000)
- **Backend API**: `https://your-app.neetodeployapp.com:3001` (port 3001)
- **Webhook Endpoints**: `https://your-app.neetodeployapp.com:3001/{uuid}`

## Database Information

The application uses SQLite for data persistence:
- **Model**: `Payload` - stores webhook request data
- **Database File**: `storage/production.sqlite3`
- **Migrations**: Automatically run during deployment via `postdeploy` script
- **Data Stored**: UUID, request data, headers, IP address, user agent, timestamps

## Troubleshooting

### Common Issues

1. **Buildpack Detection Fails**
   - Ensure `package.json` and `Gemfile` exist at root level
   - Check that `.buildpacks` file specifies the correct buildpacks including SQLite

2. **Database Issues**
   - Verify neetodeploy-sqlite addon is installed
   - Check that database migrations ran successfully in deployment logs
   - Ensure SQLite buildpack is included in configuration

3. **Frontend API Calls Fail**
   - Verify the API configuration in `webhooks-frontend/src/config/api.js`
   - Check that backend is running on port 3001

4. **Static Files Not Loading**
   - Ensure `serve` package is installed in `webhooks-frontend/package.json`
   - Verify the build process completes successfully

### Logs to Check
- Build logs: Look for buildpack detection and compilation errors
- Runtime logs: Check both frontend and backend process logs
- Database logs: Verify migrations and database operations
- Network logs: Verify API calls are reaching the correct endpoints

## Local Development

For local development, use the development commands:

```bash
# Start backend
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:frontend
```

This will run the frontend in development mode (with hot reload) and backend on separate ports.
