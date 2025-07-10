Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API info endpoint for backend status
  get "api/info" => "endpoint#api_info", as: :api_info

  # Webhook endpoints - these use UUID patterns
  post '/:uuid', to: 'endpoint#create_payload'
  get '/:uuid', to: 'endpoint#handle_get_request'
  put '/:uuid', to: 'endpoint#handle_put_request'
  patch '/:uuid', to: 'endpoint#handle_patch_request'
  delete '/:uuid', to: 'endpoint#handle_delete_request'

  # Catch-all fallback route for any requests that should be handled by frontend
  # This should never be reached in normal operation, but provides safety net
  get '*path', to: 'endpoint#frontend_fallback'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

end
