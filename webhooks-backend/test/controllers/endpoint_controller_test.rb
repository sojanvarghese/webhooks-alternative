require "test_helper"

class EndpointControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get endpoint_show_url
    assert_response :success
  end
end
