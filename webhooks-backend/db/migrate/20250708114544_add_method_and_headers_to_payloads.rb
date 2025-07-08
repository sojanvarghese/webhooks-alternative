class AddMethodAndHeadersToPayloads < ActiveRecord::Migration[7.1]
  def change
    add_column :payloads, :method, :string
    add_column :payloads, :headers, :json
  end
end
