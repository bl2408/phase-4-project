class UserAccountSerializer < ActiveModel::Serializer
  has_many :vehicle_profiles
  attributes :id, :first_name, :last_name, :vehicle_count, :vehicle_profiles


  def vehicle_count
    object.vehicle_profiles.count
  end

end
