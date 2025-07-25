class EndpointController < ApplicationController
  # GET /
  # Provides basic API information for the root route
  def api_info
    render json: {
      service: "NeetoWebhooks API",
      version: "1.0",
      description: "Webhook testing and debugging service",
      endpoints: {
        "POST /:uuid": "Store webhook payload for given UUID",
        "GET /:uuid": "Retrieve payloads for UUID or record GET webhook event",
        "GET /up": "Health check endpoint"
      },
      timestamp: Time.current.iso8601,
      status: "operational"
    }
  end

  # POST /:uuid
  # Stores the payload for the given UUID
  def create_payload
    uuid = params[:uuid]
    if uuid.blank?
      render json: { error: "UUID not provided" }, status: :bad_request and return
    end

    begin
      body = request.body.read
      data = body.presence && JSON.parse(body)
    rescue JSON::ParserError
      render json: { error: "Invalid JSON" }, status: :unprocessable_entity and return
    end

    # Capture request metadata
    payload = Payload.create(
      uuid: uuid,
      data: data,
      method: request.method,
      headers: request.headers.to_h.select { |k, v| k.start_with?('HTTP_') || %w[CONTENT_TYPE CONTENT_LENGTH].include?(k) },
      ip_address: request.remote_ip,
      user_agent: request.user_agent,
      query_params: request.query_parameters.to_json,
      content_type: request.content_type
    )

    render json: { success: true, payload: payload }, status: :created
  end

  # GET /:uuid
  # Can serve two purposes: capture GET request as webhook event OR return payloads
  def handle_get_request
    uuid = params[:uuid]
    if uuid.blank?
      render json: { error: "UUID not provided" }, status: :bad_request and return
    end

    # Check if this is a request to fetch payloads (from our frontend)
    # Frontend requests will have specific headers or query params
    if request.headers['Accept']&.include?('application/json') &&
       (request.headers['Referer']&.include?('localhost:3000') || params[:fetch_payloads] == 'true')
      # Return payloads for frontend
      payloads = Payload.where(uuid: uuid).order(created_at: :desc)
      render json: {
        payloads: payloads.map do |payload|
          {
            id: payload.id,
            uuid: payload.uuid,
            data: payload.data,
            method: payload.method,
            headers: payload.headers,
            ip_address: payload.ip_address,
            user_agent: payload.user_agent,
            query_params: payload.query_params ? JSON.parse(payload.query_params) : {},
            content_type: payload.content_type,
            created_at: payload.created_at,
            updated_at: payload.updated_at
          }
        end
      }
    else
      # Treat as webhook event
      payload = Payload.create(
        uuid: uuid,
        data: nil, # GET requests typically don't have body data
        method: request.method,
        headers: request.headers.to_h.select { |k, v| k.start_with?('HTTP_') || %w[CONTENT_TYPE CONTENT_LENGTH].include?(k) },
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        query_params: request.query_parameters.to_json,
        content_type: request.content_type
      )

      render json: { success: true, message: "GET request recorded", payload: payload }, status: :ok
    end
  end

  # Alias for backward compatibility
  alias_method :payloads, :handle_get_request

  # PUT /:uuid
  # Stores the payload for the given UUID (similar to POST)
  def handle_put_request
    handle_webhook_request('PUT')
  end

  # PATCH /:uuid
  # Stores the payload for the given UUID (similar to POST)
  def handle_patch_request
    handle_webhook_request('PATCH')
  end

  # DELETE /:uuid
  # Stores the payload for the given UUID (similar to POST)
  def handle_delete_request
    handle_webhook_request('DELETE')
  end

  # Fallback method for requests that should be handled by frontend
  # This indicates a configuration issue but provides a helpful response
  def frontend_fallback
    render json: {
      error: "Frontend route accessed directly",
      message: "This request should be handled by the React frontend. Please check your deployment configuration.",
      timestamp: Time.current.iso8601,
      path: request.path,
      method: request.method
    }, status: :not_found
  end

  private

  # Generic webhook handler for different HTTP methods
  def handle_webhook_request(method_name)
    uuid = params[:uuid]
    if uuid.blank?
      render json: { error: "UUID not provided" }, status: :bad_request and return
    end

    begin
      body = request.body.read
      data = body.presence && JSON.parse(body)
    rescue JSON::ParserError
      data = body.presence # If not JSON, store as string
    end

    # Capture request metadata
    payload = Payload.create(
      uuid: uuid,
      data: data,
      method: method_name,
      headers: request.headers.to_h.select { |k, v| k.start_with?('HTTP_') || %w[CONTENT_TYPE CONTENT_LENGTH].include?(k) },
      ip_address: request.remote_ip,
      user_agent: request.user_agent,
      query_params: request.query_parameters.to_json,
      content_type: request.content_type
    )

    render json: { success: true, message: "#{method_name} request recorded", payload: payload }, status: :ok
  end
end
