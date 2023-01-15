class VehicleProfileSerializer < ActiveModel::Serializer
  attributes :id, :make, :model, :year, :odometer, :type
end
