Rails.application.routes.draw do
  post "/login", to: "auth#create"
  post "/logout" , to: "auth#destroy"

  get "/check" , to: "auth#check"


  get '/profile', to: "user_account#show"

  get '/vehicles', to: "vehicle_profile#index"
  get '/vehicles/:id', to: "vehicle_profile#show"

end
