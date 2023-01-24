class CreateHistoryTags < ActiveRecord::Migration[7.0]
  def change
    create_table :history_tags do |t|
      t.integer :tag_id
      t.integer :vehicle_history_id

      t.timestamps
    end
  end
end
