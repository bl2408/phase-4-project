class VehicleHistorySerializer < ActiveModel::Serializer
  attributes :id, :date, :description, :odometer, :category, :updated_at

  def category
    object.category.name
  end
end
