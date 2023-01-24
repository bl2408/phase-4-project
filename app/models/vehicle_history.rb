class VehicleHistory < ApplicationRecord
  belongs_to :vehicle_profile
  belongs_to :category, class_name:'VehicleHistoryCategory', foreign_key: 'category_id'

  validates :odometer, numericality: { only_numeric: true }
end
