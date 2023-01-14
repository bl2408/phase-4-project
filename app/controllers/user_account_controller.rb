class UserAccountController < ApplicationController

    def show

        render json: { profile: @user }, status: :ok

    end


end
