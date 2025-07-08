class CreatePayloads < ActiveRecord::Migration[7.1]
  def change
    create_table :payloads do |t|
      t.string :uuid
      t.json :data

      t.timestamps
    end
  end
end
