class AuthController < ApplicationController


    def create

        user = UserLoginDatum.find_by(login_name: params[:login_name])

        if user&.authenticate(params[:password])
            render json: {msg: "welcome" }, status: :ok
        else
            render json: {error: "Failed!"}, status: :unprocessable_entity
        end

    end


    private

    def login_params
        params.permit(:login_name, :password)
    end


end
