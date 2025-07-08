class AddMoreRequestDetailsToPayloads < ActiveRecord::Migration[7.1]
  def change
    add_column :payloads, :ip_address, :string
    add_column :payloads, :user_agent, :string
    add_column :payloads, :query_params, :text
    add_column :payloads, :content_type, :string
  end
end
