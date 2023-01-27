class Tag < ApplicationRecord
    has_many :history_tags
    has_many :vehicle_histories, through: :history_tags

    validates :name, uniqueness: true

    before_save :downcase_name

    def downcase_name
        self.name.downcase!
    end
end
