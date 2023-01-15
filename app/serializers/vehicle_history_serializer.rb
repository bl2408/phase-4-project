class VehicleHistorySerializer < ActiveModel::Serializer
  attributes :id, :date, :description, :odometer, :category

  def category
    object.category.name
  end
end
