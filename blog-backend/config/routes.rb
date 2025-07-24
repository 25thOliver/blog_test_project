Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create]
      
      resources :posts do
        resources :comments, only: [:index, :create, :destroy]
      end
    end
  end
end
