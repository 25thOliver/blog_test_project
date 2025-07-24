class Api::V1::CommentsController < ApplicationController
  def index
    post = Post.find(params[:post_id])
    comments = post.comments.includes(:user).page(params[:page]).per(10)
    render json: {
      comments: comments.as_json(include: :user),
      meta: {
        current_page: comments.current_page,
        total_pages: comments.total_pages,
        total_count: comments.total_count
      }
    }
  end

  def create
    comment = Comment.new(comment_params)
    if comment.save
      render json: comment.as_json(include: :user), status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    comment.destroy
    head :no_content
  end

  private

  def comment_params
    params.require(:comment).permit(:body, :post_id, :user_id)
  end
end
