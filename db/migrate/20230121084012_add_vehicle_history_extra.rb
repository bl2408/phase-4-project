class AddVehicleHistoryExtra < ActiveRecord::Migration[7.0]
  def change

    add_column :vehicle_histories, :extras, :json

  end
end
