class Tag < ApplicationRecord
    has_many :history_tags
    has_many :vehicle_histories, through: :history_tags

    validates :name, uniqueness: true
end
