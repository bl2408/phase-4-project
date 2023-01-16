class ApplicationController < ActionController::API
    include ActionController::Cookies

    before_action :authorize
    rescue_from ActiveRecord::RecordInvalid, with: :show_errors


    private
  
  
    def authorize
      @user = UserAccount.find_by(id: session[:user_account_id])
      return response_unauthorized unless @user
    end
  
    def show_errors e
      render_response({errors: e.record.errors.full_messages}, :unprocessable_entity)
    end

    def response_not_found item
      render_response({errors: ["No #{item} found!"]}, :not_found)
    end

    def response_unauthorized
      render_response({errors: ["Unauthorized!"]}, :unauthorized)
    end

    def render_response msg, status
      render json: ActiveModelSerializers::SerializableResource.new(msg), status: status
    end
    
end
