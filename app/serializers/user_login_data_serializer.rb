class UserLoginDataSerializer < ActiveModel::Serializer

  attributes :id, :login_name, :user_account

  def user_account
    object.user_account.as_json(only:[:first_name, :last_name])
  end

end
