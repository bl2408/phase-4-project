class VehicleProfileSerializer < ActiveModel::Serializer
  attributes :id, :make, :model, :year, :body, :odometer, :type, :other, :history_types_list
end
