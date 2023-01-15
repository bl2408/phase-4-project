class VehicleProfileController < ApplicationController

    def index
        render json: @user.vehicle_profiles, each_serializer: VehicleProfileSerializer, status: :ok
    end

    def show
        vehicle = @user.vehicle_profiles.where(id: params[:id])[0];
        return render json: ["No vehicle found!"], status: :not_found unless vehicle

        render serializer: VehicleProfileHistoriesSerializer, json: vehicle, status: :ok
    end

end
