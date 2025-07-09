Rails.application.routes.draw do
  # Define the root path route ("/") - API information
  root "endpoint#api_info"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # IMPORTANT: This must come before the /:uuid routes to avoid being caught by the general pattern
  get "up" => "rails/health#show", as: :rails_health_check

  # Webhook endpoints - these use UUID patterns so they should come after specific routes
  post '/:uuid', to: 'endpoint#create_payload'
  get '/:uuid', to: 'endpoint#handle_get_request'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

end
