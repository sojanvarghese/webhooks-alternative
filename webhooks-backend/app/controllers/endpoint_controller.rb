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
       params[:fetch_payloads] == 'true'
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

  # POST /proxy
  # Proxy method to handle outbound HTTP requests from the Request Composer
  # This allows the frontend to make requests to external URLs without CORS issues
  def proxy_request
    begin
      # Parse JSON body directly to avoid Rails parameter parsing conflicts
      request_body = request.body.read
      if request_body.present?
        begin
          payload_data = JSON.parse(request_body)
        rescue JSON::ParserError
          render json: { error: "Invalid JSON in request body" }, status: :bad_request and return
        end
      else
        render json: { error: "Request body is required" }, status: :bad_request and return
      end

      # Get request parameters from parsed JSON
      url = payload_data['url']
      method = payload_data['method'] || 'GET'
      headers = payload_data['headers'] || {}
      body_data = payload_data['body']

      # Validate required parameters
      if url.blank?
        render json: { error: "URL is required" }, status: :bad_request and return
      end

      # Validate URL format
      begin
        uri = URI.parse(url)
        unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
          render json: { error: "Invalid URL format" }, status: :bad_request and return
        end
      rescue URI::InvalidURIError
        render json: { error: "Invalid URL format" }, status: :bad_request and return
      end

      # Check if this is a self-request (same domain)
      current_host = request.host
      uri = URI.parse(url)

      # If it's a self-request to our own webhook endpoint, handle it internally
      if uri.host == current_host && /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.match(uri.path)
        # Extract UUID from the path
        webhook_uuid = uri.path.sub('/', '')

        # Create payload directly instead of making HTTP request
        payload = Payload.create(
          uuid: webhook_uuid,
          data: body_data,
          method: method,
          headers: { 'Content-Type' => 'application/json', 'User-Agent' => 'Ruby' },
          ip_address: request.remote_ip,
          user_agent: 'Ruby',
          query_params: uri.query || '',
          content_type: 'application/json'
        )

        # Return the same response format as a successful webhook call
        render json: {
          success: true,
          status: 201,
          statusText: 'Created',
          data: { success: true, payload: payload },
          headers: { 'content-type' => ['application/json; charset=utf-8'] },
          timestamp: Time.current.iso8601
        }
        return
      end

      # Make the HTTP request for external URLs
      require 'net/http'
      require 'json'

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = 30
      http.open_timeout = 30

      # Skip SSL verification for self-requests in production to avoid certificate issues
      if uri.host == current_host
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end

      # Create the request
      case method.upcase
      when 'GET'
        request = Net::HTTP::Get.new(uri.request_uri)
      when 'POST'
        request = Net::HTTP::Post.new(uri.request_uri)
      when 'PUT'
        request = Net::HTTP::Put.new(uri.request_uri)
      when 'PATCH'
        request = Net::HTTP::Patch.new(uri.request_uri)
      when 'DELETE'
        request = Net::HTTP::Delete.new(uri.request_uri)
      else
        render json: { error: "Unsupported HTTP method" }, status: :bad_request and return
      end

      # Set headers (filter out unsafe headers that browsers don't allow)
      unsafe_headers = %w[
        Accept-Charset Accept-Encoding Access-Control-Request-Headers
        Access-Control-Request-Method Connection Content-Length Cookie
        Cookie2 Date DNT Expect Host Keep-Alive Origin Referer
        TE Trailer Transfer-Encoding Upgrade User-Agent Via
      ].map(&:downcase)

      headers.each do |key, value|
        unless unsafe_headers.include?(key.downcase)
          request[key] = value
        end
      end

      # Set body for non-GET requests
      if method.upcase != 'GET' && body_data.present?
        if body_data.is_a?(Hash) || body_data.is_a?(Array)
          request.body = body_data.to_json
          request['Content-Type'] = 'application/json' unless request['Content-Type']
        else
          request.body = body_data.to_s
        end
      end

      # Execute the request
      response = http.request(request)

      # Parse response body
      response_body = response.body
      begin
        parsed_body = JSON.parse(response_body) if response_body.present?
      rescue JSON::ParserError
        parsed_body = response_body
      end

      # Return response
      render json: {
        success: response.code.to_i < 400,
        status: response.code.to_i,
        statusText: response.message,
        data: parsed_body,
        headers: response.to_hash,
        timestamp: Time.current.iso8601
      }

    rescue Net::TimeoutError
      render json: {
        success: false,
        error: "Request timeout",
        timestamp: Time.current.iso8601
      }, status: :request_timeout
    rescue Net::HTTPError => e
      render json: {
        success: false,
        error: "HTTP error: #{e.message}",
        timestamp: Time.current.iso8601
      }, status: :bad_gateway
    rescue StandardError => e
      render json: {
        success: false,
        error: "Request failed: #{e.message}",
        timestamp: Time.current.iso8601
      }, status: :internal_server_error
    end
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
