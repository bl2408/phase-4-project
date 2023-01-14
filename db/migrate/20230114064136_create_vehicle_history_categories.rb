class CreateVehicleHistoryCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :vehicle_history_categories do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
