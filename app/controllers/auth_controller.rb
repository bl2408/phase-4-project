class AuthController < ApplicationController

    skip_before_action :authorize, only: [:create]

    def create

        user = UserLoginDatum.find_by(login_name: params[:login_name])

        if user&.authenticate(params[:password])

            session[:user_account_id] = user.id

            render json: {msg: "welcome" }, status: :ok
        else
            render json: {error: "Failed!"}, status: :unprocessable_entity
        end

    end

    def destroy
        session.delete(:user_account_id)
        head :no_content
    end

    def check

        render json: { msg: "Secret" }, status: :ok

    end

end
