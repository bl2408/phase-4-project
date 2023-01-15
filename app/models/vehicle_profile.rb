class VehicleProfile < ApplicationRecord
  belongs_to :user_account
  has_many :vehicle_histories

  validates :make, presence: true
  validates :model, presence: true
  validates :year, presence: true

end