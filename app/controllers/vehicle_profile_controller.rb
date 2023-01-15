class VehicleProfileController < ApplicationController

    def index
        res results: @user.vehicle_profiles, each_serializer: VehicleProfileSerializer, status: :ok
    end

    def show
        vehicle = @user.vehicle_profiles.where(id: params[:id])[0];
        return res error: ["No vehicle found!"], status: :unprocessable_entity unless vehicle

        res(serializer: VehicleProfileHistoriesSerializer, results: vehicle, status: :ok)
    end

end
