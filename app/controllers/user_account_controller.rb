class UserAccountController < ApplicationController

    def show
        render json: @user, serializer: UserProfileVehicleProfileSerializer, status: :ok
    end


end
