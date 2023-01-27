class VehicleProfile < ApplicationRecord
  belongs_to :user_account
  has_many :vehicle_histories, dependent: :destroy

  has_many :tags, through: :vehicle_histories

  # has_many :categories, through: :vehicle_histories

  validates :make, presence: true
  validates :model, presence: true
  validates :year, presence: true, numericality: { only_numeric: true }
  validates :odometer, numericality: { only_numeric: true }

end
