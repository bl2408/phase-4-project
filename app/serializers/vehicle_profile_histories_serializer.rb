class VehicleProfileHistoriesSerializer < ActiveModel::Serializer
  # has_many :vehicle_histories, key: :history, serializer: VehicleHistorySerializer
  attributes :id, :make, :model, :year, :body, :odometer, :type, :other


  def attributes(*args)
    hash = super

    his = object.vehicle_histories
    his_lim = his.limit(10)

    hash[:history] = {
        **ActiveModelSerializers::SerializableResource.new(his_lim, each_serializer: VehicleHistorySerializer).as_json,
        meta_history: {
          count: his_lim.size,
          total: his.count
        }
      }
    hash
  end

  

  

end
