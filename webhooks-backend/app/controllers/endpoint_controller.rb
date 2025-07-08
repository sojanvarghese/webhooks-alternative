class EndpointController < ApplicationController
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
end
