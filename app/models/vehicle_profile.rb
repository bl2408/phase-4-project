class VehicleProfile < ApplicationRecord
  belongs_to :user_account

  validates :make, presence: true
  validates :model, presence: true
  validates :year, presence: true

end
