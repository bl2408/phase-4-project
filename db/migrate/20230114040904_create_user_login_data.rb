class CreateUserLoginData < ActiveRecord::Migration[7.0]
  def change
    create_table :user_login_data do |t|
      t.references :user_account, null: false, foreign_key: true
      t.string :login_name
      t.string :password_digest
      t.string :email

      t.timestamps
    end
  end
end
