Rails.application.routes.draw do
  root "pages#index"
  get "pages/index"
  resources :posts do
    resources :comments, only: [ :create, :destroy ]
  end
  resources :users, only: [ :new, :create ]
end
