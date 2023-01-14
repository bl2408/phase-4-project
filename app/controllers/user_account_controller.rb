class UserAccountController < ApplicationController

    def show

        render json: @user, status: :ok


    end


end
