class UserLoginDatum < ApplicationRecord
  belongs_to :user_account
  has_secure_password

  validates :login_name, presence: true, uniqueness: true
  validates :email, uniqueness: true

end
