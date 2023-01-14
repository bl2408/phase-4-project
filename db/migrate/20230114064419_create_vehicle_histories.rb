class CreateVehicleHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :vehicle_histories do |t|
      t.references :vehicle_profile, null: false, foreign_key: true
      t.datetime :date
      t.string :description
      t.integer :odometer
      # t.references :category, foreign_key: { to_table: 'vehicle_history_categories' }

      t.timestamps
    end

    add_reference :vehicle_histories, :category, foreign_key: { to_table: :vehicle_history_categories }

  end
end
