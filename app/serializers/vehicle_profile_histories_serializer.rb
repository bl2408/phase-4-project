class VehicleProfileHistoriesSerializer < ActiveModel::Serializer
  # has_many :vehicle_histories, key: :history, serializer: VehicleHistorySerializer
  attributes :id, :make, :model, :year, :body, :odometer, :vehicle_type, :other, :history_types_list, :tags_list

  def attributes(*args)
    hash = super

    his = object.vehicle_histories
    his_lim = his.limit(10).order(date: :desc)

    hash[:history] = {
        **ActiveModelSerializers::SerializableResource.new(his_lim, each_serializer: VehicleHistorySerializer).as_json,
        meta: {
          count: his_lim.size,
          total: his.count,
          offset: 0,
          limit: 10,
          order: "DESC",
          tag: nil
        }
      }
    hash
  end

  

  

end
