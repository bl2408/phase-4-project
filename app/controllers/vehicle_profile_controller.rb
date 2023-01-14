class VehicleProfileController < ApplicationController

    def index
        render json: @user.vehicle_profiles, status: :ok
    end

    def show
        vehicle = @user.vehicle_profiles.where(id: params[:id])[0];
        history = vehicle.vehicle_histories.limit(10).includes(:category)

        vehicle = vehicle.attributes.merge(
            'history' => history.map do |rec|
                rec = rec.attributes.merge(
                    "category_name" =>  rec.category.name
                )
            end,
        )
        render json: vehicle, status: :ok
    end

end
