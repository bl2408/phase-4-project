class VehicleProfileSerializer < ActiveModel::Serializer
  belongs_to :user_account
  attributes :id, :make, :model, :year, :body, :odometer, :other
end
