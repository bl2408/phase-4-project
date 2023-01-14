class UserProfileVehicleProfileSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :vehicle_count
  
  def vehicle_count
    object.vehicle_profiles.count
  end

end
