Rails.application.routes.draw do
  post "/login", to: "auth#create"
  post "/logout" , to: "auth#destroy"

  get "/check" , to: "auth#render_user"

  get '/profile', to: "user_account#show"

  get '/vehicles', to: "vehicle_profile#index"
  get '/vehicles/:id', to: "vehicle_profile#show"

  get '/vehicles/:vehicle_id/history', to: "vehicle_history#index"
  get '/vehicles/:vehicle_id/history/:id', to: "vehicle_history#show"


end
