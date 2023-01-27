Rails.application.routes.draw do
  post "/login", to: "auth#create"
  post "/logout" , to: "auth#destroy"

  get "/check" , to: "auth#render_user"

  get '/profile', to: "user_account#show"

  get '/vehicles', to: "vehicle_profile#index"
  get '/vehicles/:id', to: "vehicle_profile#show"
  
  post '/vehicles', to: "vehicle_profile#create"
  put '/vehicles/:vehicle_id', to: "vehicle_profile#update"
  patch '/vehicles/:vehicle_id', to: "vehicle_profile#update"
  delete '/vehicles/:vehicle_id', to: "vehicle_profile#destroy"
  
  get '/vehicles/:vehicle_id/tags', to: "vehicle_profile#get_updated_tags"

  get '/vehicles/:vehicle_id/history', to: "vehicle_history#index"
  get '/vehicles/:vehicle_id/history/:id', to: "vehicle_history#show"
  
  post '/vehicles/:vehicle_id/history', to: "vehicle_history#create"

  put '/vehicles/:vehicle_id/history/:id', to: "vehicle_history#update"
  patch '/vehicles/:vehicle_id/history/:id', to: "vehicle_history#update"

  delete '/vehicles/:vehicle_id/history/:id', to: "vehicle_history#destroy"

  get '/list/categories', to: "vehicle_profile#categories"


end
