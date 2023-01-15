class VehicleHistoryController < ApplicationController

    def index
        ve_id = @user.vehicle_profiles.find_by(id: params[:vehicle_id])    
        return render json: ["No vehicle found!"], status: :not_found unless ve_id
        
        offset = params[:offset] || 0
        limit = params[:limit] || 10
        order = params[:order] || 'ASC'

        query = VehicleHistory.all.where(vehicle_profile_id: ve_id)
        res = query.limit(limit).offset(offset)

        # serialization_options[:option_name]
        render json: res.order("date #{order.upcase}"), status: :ok, meta: { total: query.count, count: res.size }

    end

end
