class ApplicationController < ActionController::API
    include ActionController::Cookies

    before_action :authorize
    rescue_from ActiveRecord::RecordInvalid, with: :show_errors
  
    private
  
  
    def authorize
      @user = UserAccount.find_by(id: session[:user_account_id])
      return res error: ["Not authorized!"], status: :unauthorized unless @user
    end
  
    def show_errors e
      res error: e.record.errors.full_messages, status: :unprocessable_entity
    end


    def res(serializer: ActiveModelSerializers::SerializableResource, results: nil, status:, error: nil, each_serializer: nil)

      results = serializer.new(results, each_serializer: each_serializer ? each_serializer : nil)
      success = error ? false : true

      render json: {
          results: error ? error : results,
          success: success,
          status: status
      },  status: status
    end
    
end
