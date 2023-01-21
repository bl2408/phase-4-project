class VehicleHistorySerializer < ActiveModel::Serializer
  attributes :id, :date, :description, :odometer, :category, :updated_at, :extras

  def category
    object.category.name
  end
end
