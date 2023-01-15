class VehicleHistorySerializer < ActiveModel::Serializer
  attributes :id, :date, :description, :odometer, :category

  def category
    pp object.category.name
  end
end
