class VehicleProfileHistoriesSerializer < ActiveModel::Serializer
  has_many :vehicle_histories, key: :history
  attributes :id, :make, :model, :year, :body, :odometer, :type, :other


end
