class VehicleProfileController < ApplicationController

    def index
        render json: @user.vehicle_profiles, each_serializer: VehicleProfileSerializer, status: :ok
    end

    def show
        vehicle = @user.vehicle_profiles.where(id: params[:id])[0];
        return response_not_found("vehicle") unless vehicle

        render serializer: VehicleProfileHistoriesSerializer, json: vehicle, status: :ok
    end

    def create

        pp vehicle_params

        @user.vehicle_profiles.create!( vehicle_params)

        render json: { success: true }, status: :created

        # @User.vehicle_profile

    end

    def categories
        render json: VehicleHistoryCategory.all, status: :ok
    end

    private

    def vehicle_params
        params.require(:vehicle_profile).permit(:make, :model, :vehicle_type, :body, :year, :odometer)
    end

end
