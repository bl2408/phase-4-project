class VehicleHistory < ApplicationRecord
  belongs_to :vehicle_profile
  belongs_to :category, class_name:'VehicleHistoryCategory', foreign_key: 'category_id'
  
  has_many :history_tags
  has_many :tags, through: :history_tags

  validates :odometer, numericality: { only_numeric: true }
end
