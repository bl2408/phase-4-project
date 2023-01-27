class VehicleHistoryController < ApplicationController

    before_action :get_ve_prof

    def index
        params[:offset] ||= 0
        params[:limit] ||= 10
        params[:order] ||= ""
        params[:tag] ||= nil

        order = 'DESC' # default
        params[:order] = params[:order].upcase if params[:order].to_s #if string then upcase
        order = params[:order] if params[:order] == "ASC" || params[:order] == "DESC" # set option only if asc or desc

        limit = check_int_set_int_param(10, params[:limit], 1, 30)

        offset = check_int_set_int_param(0, params[:offset], 0, 30)

        query = VehicleHistory.all.where(vehicle_profile_id: @ve_prof)

        if params[:tag] != nil
            query = query.joins(:tags).merge(Tag.where(name: params[:tag]))
        end

        res = query.limit(limit).offset(offset)

        render json: res.order("date #{order.upcase}"), status: :ok, 
        meta: { 
            total: query.count, 
            count: res.size, 
            offset: offset, 
            limit: limit, 
            order: order,
            tag: params[:tag]
        }

    end

    def show
        query = VehicleHistory.find_by(vehicle_profile_id: @ve_prof, id: params[:id])
        return response_not_found("history") unless query

        render json: query, status: :ok
    end

    def create 
        details = history_params
        details[:vehicle_profile] = @ve_prof
        @hist = VehicleHistory.create!(details)

        set_tags

        insert_extras_profile
        render json: @hist, status: :ok
    end

    def update
        @hist = VehicleHistory.find_by(id: params[:id])

        set_tags

        insert_extras_profile

        @hist.update(history_params)

        render json: @hist, status: :ok
    end

    def destroy
        hist = VehicleHistory.find_by(id: params[:id])
        hist.destroy
        head :no_content
    end

    private 

    def set_tags
        if params[:tags]
            # find and add tags
            params[:tags].map do |tag|
                tag = Tag.find_or_create_by(name: tag)
                HistoryTag.find_or_create_by(tag: tag, vehicle_history: @hist)
            end

            # remove tags
            @hist.tags.map do |hist_tag|
                @hist.history_tags.find_by(tag: hist_tag).destroy unless params[:tags].include? hist_tag.name
            end
        else
            @hist.history_tags.destroy_all
        end
    end

    def insert_extras_profile
        ve_prof_hist_types = @ve_prof.history_types_list

        update_details = history_params
        
        other_name = !!update_details[:extras] ? update_details[:extras][:other][:name] : nil
        if !!other_name
            if !!ve_prof_hist_types
                ve_prof_hist_types.push(other_name) unless ve_prof_hist_types.include?(other_name)
                @ve_prof.update(history_types_list: ve_prof_hist_types)
            else 
                @ve_prof.update(history_types_list: [ other_name ])
            end
        else
            if !!@hist
                @hist.extras = nil
                @hist.save
            end
        end

    end

    def history_params
        getParams = params.require(:vehicle_history).permit(:odometer, :description, :date, :category_id, 
            extras: [ other: [ :name ] ]
        )
        getParams[:date] = Time.parse(getParams[:date]).getutc
        getParams
    end

    def check_int_set_int_param default, param, start_no, end_no
        param = param.to_i
        return param if param >=start_no && param <= end_no # set option only if between start to end
        default
    end

    def get_ve_prof
        @ve_prof = @user.vehicle_profiles.find_by(id: params[:vehicle_id])           
        return response_not_found("vehicle") unless @ve_prof
    end

end
