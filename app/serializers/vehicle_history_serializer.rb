class VehicleHistorySerializer < ActiveModel::Serializer
  # has_many :tags, through: :history_tags, serializer: TagsSerializer
  attributes :id, :date, :description, :odometer, :category, :updated_at, :extras, :tags

  def category
    object.category.name
  end

  def tags
    object.tags.map do |tag|
      TagSerializer.new(tag)
    end
  end

end
