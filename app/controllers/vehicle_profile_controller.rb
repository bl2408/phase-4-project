class VehicleProfileController < ApplicationController

    before_action :get_ve_prof, only: [:update, :get_updated_tags, :get_updated_odo, :destroy]

    def index
        render json: @user.vehicle_profiles, each_serializer: VehicleProfileSerializer, status: :ok
    end

    def show
        vehicle = @user.vehicle_profiles.where(id: params[:id])[0];
        return response_not_found("vehicle") unless vehicle

        render serializer: VehicleProfileHistoriesSerializer, json: vehicle, status: :ok
    end

    def create
        @user.vehicle_profiles.create!( vehicle_params)
        render json: { success: true }, status: :created
    end

    def update
        @ve_prof.update!(vehicle_params)
        render json: { success: true }, status: :ok
    end

    def destroy 
        @ve_prof.destroy
        head :no_content
    end

    def categories
        render json: VehicleHistoryCategory.all, status: :ok
    end

    def get_updated_tags
        render json: @ve_prof.tags_list, status: :ok
    end

    def get_updated_odo
        render json: {calculated_odometer: @ve_prof.calculated_odometer}, status: :ok
    end

    private

    def get_ve_prof
        @ve_prof = VehicleProfile.find_by(id: params[:vehicle_id])       
        return response_not_found("vehicle") unless @ve_prof
    end

    def vehicle_params
        params.require(:vehicle_profile).permit(:make, :model, :vehicle_type, :body, :year, :odometer)
    end

end
