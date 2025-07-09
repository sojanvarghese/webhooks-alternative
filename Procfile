# Production Procfile for NeetoDeploy
# Follows NeetoDeploy best practices for Rails + React apps

# Release: Ensure database setup before migrations
release: cd webhooks-backend && mkdir -p storage && bundle exec rake db:create db:schema:load db:migrate

# Web: Rails API server
web: cd webhooks-backend && bundle exec puma -C config/puma.rb
