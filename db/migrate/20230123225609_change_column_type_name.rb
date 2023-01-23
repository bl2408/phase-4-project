class ChangeColumnTypeName < ActiveRecord::Migration[7.0]
  def change

    rename_column :vehicle_profiles, :type, :vehicle_type

  end
end
