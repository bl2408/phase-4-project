Rails.application.routes.draw do
  post "/login", to: "auth#create"
  post "/logout" , to: "auth#destroy"

  get "/check" , to: "auth#check"


  get '/profile', to: "user_account#show"

end
