class AuthController < ApplicationController

    skip_before_action :authorize, only: [:create]

    def create
        user_login = UserLoginDatum.find_by(login_name: params[:login_name])

        if user_login&.authenticate(params[:password])

            acc_id = user_login.user_account_id

            session[:user_account_id] = acc_id

            @user = UserAccount.find_by(id: acc_id)

            render_user
            
        else
            response_unprocessable_entity "Incorrect username/password!"
        end
    end

    def destroy
        session.delete(:user_account_id)
        head :no_content
    end

    def render_user
        render json: @user, status: :ok
    end

end
