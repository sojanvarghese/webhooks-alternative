# Production Procfile for NeetoDeploy
# Uses static file serving for frontend and Rails API for backend

# Backend: Rails API server
backend: cd webhooks-backend && bundle exec rails server -p 3001 -b 0.0.0.0

# Frontend: Build React app and serve static files (production-ready)
frontend: cd webhooks-frontend && yarn run build && yarn dlx serve -s build -l 3000

# Alternative: Use the root server.js for orchestration
# web: node server.js
