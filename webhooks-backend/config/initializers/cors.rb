# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# Allow CORS requests from the React frontend during development and production
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow development origin
    origins "http://localhost:3000"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end

  # Allow NeetoDeploy production origins
  allow do
    origins /https:\/\/.*\.neetodeployapp\.com/

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
