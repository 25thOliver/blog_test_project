class Api::V1::PostsController < ApplicationController
  def index
    posts = Post.includes(:user, :comments).page(params[:page]).per(10)
    render json: {
      posts: posts.as_json(include: [:user, comments: { include: :user }]),
      meta: {
        current_page: posts.current_page,
        total_pages: posts.total_pages,
        total_count: posts.total_count
      }
    }
  end

  def show
    post = Post.includes(:user, :comments).find(params[:id])
    render json: post.as_json(include: [:user, comments: { include: :user}])
  end

  def create
    post = Post.new(post_params)
    if post.save
      render json: post, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: unprocessable_entity
    end
  end

  def update
    post = Post.find(params[:id])
    if post.update(post_params)
      render json: post
    else
      render json: { errors: post.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    post = Post.find(params[:id])
    post.destroy
    head :no_content
  end

  private

  def post_params
    params.require(:post).permit(:title, :body, :user_id)
  end
end
