class VehicleProfile < ApplicationRecord
  belongs_to :user_account
  has_many :vehicle_histories, dependent: :destroy

  has_many :tags, through: :vehicle_histories

  validates :make, presence: true
  validates :model, presence: true
  validates :year, presence: true, numericality: { only_numeric: true }
  validates :odometer, numericality: { only_numeric: true }

  def tags_list
    tags.group(:name).count
  end

  def calculated_odometer
    calc = vehicle_histories.maximum(:odometer)
    return odometer unless calc
    calc
  end

end
