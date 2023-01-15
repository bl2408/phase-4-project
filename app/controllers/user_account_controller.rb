class UserAccountController < ApplicationController

    def show
        res results: @user, serializer: UserProfileVehicleProfileSerializer, status: :ok
    end


end
