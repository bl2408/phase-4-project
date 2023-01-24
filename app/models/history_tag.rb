class HistoryTag < ApplicationRecord
  belongs_to :tag
  belongs_to :vehicle_history
end
