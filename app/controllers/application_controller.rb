class ApplicationController < ActionController::API
    include ActionController::Cookies

    before_action :authorize
    rescue_from ActiveRecord::RecordInvalid, with: :show_errors
  
    private
  
  
    def authorize
      @user = UserAccount.find_by(id: session[:user_account_id])
      return render json: { errors: ["Not authorized!"] }, status: :unauthorized unless @user
    end
  
    def show_errors e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
    
end
