class CreateVehicleProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :vehicle_profiles do |t|
      t.references :user_account, null: false, foreign_key: true
      t.string :type
      t.string :make
      t.string :model
      t.string :year
      t.string :body
      t.integer :odometer
      t.json :other
      t.json :history_types_list

      t.timestamps
    end
  end
end
