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
    Rails.logger.info "[PROXY REQUEST] Starting proxy request processing"
    Rails.logger.info "[PROXY REQUEST] Request details: method=#{request.method}, content_type=#{request.content_type}, remote_ip=#{request.remote_ip}"

    begin
      # Parse JSON body directly to avoid Rails parameter parsing conflicts
      request_body = request.body.read
      Rails.logger.info "[PROXY REQUEST] Request body length: #{request_body.length}"

      if request_body.present?
        Rails.logger.info "[PROXY REQUEST] Parsing JSON request body..."
        begin
          payload_data = JSON.parse(request_body)
          Rails.logger.info "[PROXY REQUEST] JSON parsed successfully: #{payload_data.inspect}"
        rescue JSON::ParserError => e
          Rails.logger.error "[PROXY REQUEST] JSON parse error: #{e.message}"
          render json: { error: "Invalid JSON in request body" }, status: :bad_request and return
        end
      else
        Rails.logger.error "[PROXY REQUEST] Empty request body"
        render json: { error: "Request body is required" }, status: :bad_request and return
      end

      # Get request parameters from parsed JSON
      url = payload_data['url']
      method = payload_data['method'] || 'GET'
      headers = payload_data['headers'] || {}
      body_data = payload_data['body']

      Rails.logger.info "[PROXY REQUEST] Extracted parameters: url=#{url}, method=#{method}, headers=#{headers.keys.join(',')}, body_present=#{body_data.present?}"

      # Validate required parameters
      if url.blank?
        Rails.logger.error "[PROXY REQUEST] URL is blank"
        render json: { error: "URL is required" }, status: :bad_request and return
      end

      # Validate URL format
      begin
        uri = URI.parse(url)
        Rails.logger.info "[PROXY REQUEST] Parsed URI: scheme=#{uri.scheme}, host=#{uri.host}, port=#{uri.port}, path=#{uri.path}"
        unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
          Rails.logger.error "[PROXY REQUEST] Invalid URL scheme: #{uri.scheme}"
          render json: { error: "Invalid URL format" }, status: :bad_request and return
        end
      rescue URI::InvalidURIError => e
        Rails.logger.error "[PROXY REQUEST] URI parse error: #{e.message}"
        render json: { error: "Invalid URL format" }, status: :bad_request and return
      end

      # Check if this is a self-request (same domain)
      current_host = request.host
      uri = URI.parse(url)
      Rails.logger.info "[PROXY REQUEST] Host comparison: current_host=#{current_host}, target_host=#{uri.host}"

      # If it's a self-request to our own webhook endpoint, handle it internally
      if uri.host == current_host && /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.match(uri.path)
        Rails.logger.info "[PROXY REQUEST] Detected self-request to webhook endpoint"

        # Extract UUID from the path
        webhook_uuid = uri.path.sub('/', '')
        Rails.logger.info "[PROXY REQUEST] Extracted webhook UUID: #{webhook_uuid}"

        # Parse query parameters properly
        query_params = if uri.query.present?
          Rails.logger.info "[PROXY REQUEST] Parsing query parameters: #{uri.query}"
          CGI.parse(uri.query).transform_values(&:first)
        else
          Rails.logger.info "[PROXY REQUEST] No query parameters found"
          {}
        end

        Rails.logger.info "[PROXY REQUEST] Parsed query params: #{query_params.inspect}"

        # Create payload directly instead of making HTTP request
        Rails.logger.info "[PROXY REQUEST] Creating payload for self-request"
        payload = Payload.create(
          uuid: webhook_uuid,
          data: body_data,
          method: method,
          headers: { 'Content-Type' => 'application/json', 'User-Agent' => 'Ruby' },
          ip_address: request.remote_ip,
          user_agent: 'Ruby',
          query_params: query_params.to_json,
          content_type: 'application/json'
        )

        Rails.logger.info "[PROXY REQUEST] Payload created successfully: id=#{payload.id}, uuid=#{payload.uuid}"

        # Return the same response format as a successful webhook call
        response_data = {
          success: true,
          status: 201,
          statusText: 'Created',
          data: { success: true, payload: payload },
          headers: { 'content-type' => ['application/json; charset=utf-8'] },
          timestamp: Time.current.iso8601
        }

        Rails.logger.info "[PROXY REQUEST] Returning self-request response: #{response_data.inspect}"
        render json: response_data
        return
      end

      Rails.logger.info "[PROXY REQUEST] Processing external request to #{uri.host}"

      # Make the HTTP request for external URLs
      require 'net/http'
      require 'net/https'
      require 'json'

      Rails.logger.info "[PROXY REQUEST] Creating HTTP client for #{uri.scheme}://#{uri.host}:#{uri.port}"

      # Use Net::HTTP.start for better connection management
      http_opts = {
        use_ssl: uri.scheme == 'https',
        read_timeout: 30,
        open_timeout: 30
      }

      if uri.scheme == 'https'
        http_opts[:verify_mode] = OpenSSL::SSL::VERIFY_PEER
        Rails.logger.info "[PROXY REQUEST] HTTPS client configured with SSL verification"
      end

      Rails.logger.info "[PROXY REQUEST] HTTP client configured: ssl=#{http_opts[:use_ssl]}, timeout=30"

      # Skip SSL verification for self-requests in production to avoid certificate issues
      if uri.host == current_host
        Rails.logger.info "[PROXY REQUEST] Skipping SSL verification for self-request"
        http_opts[:verify_mode] = OpenSSL::SSL::VERIFY_NONE
      end

      # Create the request
      Rails.logger.info "[PROXY REQUEST] Creating HTTP request: method=#{method.upcase}"
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
        Rails.logger.error "[PROXY REQUEST] Unsupported HTTP method: #{method}"
        render json: { error: "Unsupported HTTP method" }, status: :bad_request and return
      end

      # Set headers (filter out unsafe headers that browsers don't allow)
      unsafe_headers = %w[
        Accept-Charset Accept-Encoding Access-Control-Request-Headers
        Access-Control-Request-Method Connection Content-Length Cookie
        Cookie2 Date DNT Expect Host Keep-Alive Origin Referer
        TE Trailer Transfer-Encoding Upgrade User-Agent Via
      ].map(&:downcase)

      Rails.logger.info "[PROXY REQUEST] Setting headers..."
      headers.each do |key, value|
        unless unsafe_headers.include?(key.downcase)
          request[key] = value
          Rails.logger.debug "[PROXY REQUEST] Set header: #{key}=#{value}"
        else
          Rails.logger.debug "[PROXY REQUEST] Skipped unsafe header: #{key}"
        end
      end

      # Set body for non-GET requests
      if method.upcase != 'GET' && body_data.present?
        Rails.logger.info "[PROXY REQUEST] Setting request body"
        if body_data.is_a?(Hash) || body_data.is_a?(Array)
          request.body = body_data.to_json
          request['Content-Type'] = 'application/json' unless request['Content-Type']
          Rails.logger.info "[PROXY REQUEST] Set JSON body, length: #{request.body.length}"
        else
          request.body = body_data.to_s
          Rails.logger.info "[PROXY REQUEST] Set string body, length: #{request.body.length}"
        end
      else
        Rails.logger.info "[PROXY REQUEST] No body set (GET request or empty body)"
      end

      # Execute the request
      Rails.logger.info "[PROXY REQUEST] Executing HTTP request..."
      start_time = Time.current

      response = Net::HTTP.start(uri.host, uri.port, http_opts) do |http|
        http.request(request)
      end

      end_time = Time.current

      Rails.logger.info "[PROXY REQUEST] HTTP request completed: status=#{response.code}, duration=#{(end_time - start_time).round(3)}s"

      # Parse response body
      response_body = response.body
      Rails.logger.info "[PROXY REQUEST] Response body length: #{response_body&.length || 0}"

      begin
        parsed_body = JSON.parse(response_body) if response_body.present?
        Rails.logger.info "[PROXY REQUEST] Response body parsed as JSON"
      rescue JSON::ParserError => e
        Rails.logger.info "[PROXY REQUEST] Response body is not JSON: #{e.message}"
        parsed_body = response_body
      end

      # Return response
      response_data = {
        success: response.code.to_i < 400,
        status: response.code.to_i,
        statusText: response.message,
        data: parsed_body,
        headers: response.to_hash,
        timestamp: Time.current.iso8601
      }

      Rails.logger.info "[PROXY REQUEST] Returning external request response: success=#{response_data[:success]}, status=#{response_data[:status]}"
      render json: response_data

    rescue Net::ReadTimeout, Net::OpenTimeout => e
      Rails.logger.error "[PROXY REQUEST] Request timeout: #{e.message}"
      render json: {
        success: false,
        error: "Request timeout",
        timestamp: Time.current.iso8601
      }, status: :request_timeout
    rescue Net::HTTPError => e
      Rails.logger.error "[PROXY REQUEST] HTTP error: #{e.message}"
      render json: {
        success: false,
        error: "HTTP error: #{e.message}",
        timestamp: Time.current.iso8601
      }, status: :bad_gateway
    rescue StandardError => e
      Rails.logger.error "[PROXY REQUEST] Unexpected error: #{e.class.name}: #{e.message}"
      Rails.logger.error "[PROXY REQUEST] Backtrace: #{e.backtrace.first(5).join('\n')}"
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
