# Production Procfile for NeetoDeploy
# Monolithic deployment with Express server serving React frontend and proxying to Rails API

# Release: Ensure database setup before migrations
release: cd webhooks-backend && mkdir -p storage && bundle exec rake db:create db:schema:load db:migrate

# Web: Express server that serves React frontend and proxies API requests to Rails
web: node server.js
