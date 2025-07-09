# Production Procfile for NeetoDeploy
# Follows NeetoDeploy best practices for Rails + React apps

# Release: Run database migrations after deployment
release: cd webhooks-backend && bundle exec rake db:migrate

# Web: Rails API server
web: cd webhooks-backend && bundle exec puma -C config/puma.rb
