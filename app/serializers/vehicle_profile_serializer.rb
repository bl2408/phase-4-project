class VehicleProfileSerializer < ActiveModel::Serializer
  attributes :id, :make, :model, :year, :odometer, :vehicle_type
end
