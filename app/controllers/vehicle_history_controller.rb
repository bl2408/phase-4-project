class VehicleHistoryController < ApplicationController

    before_action :get_ve_id

    def index
        params[:offset] ||= 0
        params[:limit] ||= 10
        params[:order] ||= ""

        order = 'DESC' # default
        params[:order] = params[:order].upcase if params[:order].to_s #if string then upcase
        order = params[:order] if params[:order] == "ASC" || params[:order] == "DESC" # set option only if asc or desc

        limit = check_int_set_int_param(10, params[:limit], 1, 30)

        offset = check_int_set_int_param(0, params[:offset], 0, 30)

        query = VehicleHistory.all.where(vehicle_profile_id: @ve_id)
        res = query.limit(limit).offset(offset)

        render json: res.order("date #{order.upcase}"), status: :ok, 
        meta: { total: query.count, count: res.size, offset: offset, limit: limit, order: order}

    end

    def show
        query = VehicleHistory.find_by(vehicle_profile_id: @ve_id, id: params[:id])
        return response_not_found("history") unless query

        render json: query, status: :ok
    end

    def update
        hist = VehicleHistory.find_by(id: params[:id])
        update_details = params.require(:vehicle_history).permit(:odometer, :description, :date, :category_id, 
            extras: [ other: [ :name ] ]
        )

        update_details[:date] = Time.parse(update_details[:date]).getutc
        
        ve_profile = VehicleProfile.find_by(id: @ve_id)
        ve_prof_hist_types = ve_profile.history_types_list
        
        other_name = !!update_details[:extras] ? update_details[:extras][:other][:name] : nil
        if !!other_name
            if !!ve_prof_hist_types
                ve_prof_hist_types.push(other_name) unless ve_prof_hist_types.include?(other_name)
                ve_profile.update(history_types_list: ve_prof_hist_types)
            else 
                ve_profile.update(history_types_list: [ other_name ])
            end
        else
            hist.extras = nil
            hist.save
        end



        hist.update(update_details)

        render json: hist, status: :ok
    end

    private 

    def check_int_set_int_param default, param, start_no, end_no
        param = param.to_i
        return param if param >=start_no && param <= end_no # set option only if between start to end
        default
    end

    def get_ve_id
        @ve_id = @user.vehicle_profiles.find_by(id: params[:vehicle_id])    
        return response_not_found("vehicle") unless @ve_id
    end

end
