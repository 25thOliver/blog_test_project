class CommentsController < ApplicationController
  before_action :set_post

  # POST /posts/:post_id/comments
  def create
    @comment = @post.comments.build(comment_params)

    respond_to do |format|
      if @comment.save
        format.html { redirect_to @post, notice: "Comment was successfully created." }
        format.turbo_stream
      else
        format.html { redirect_to @post, alert: "Failed to create comment." } # Fallback for HTML
        format.turbo_stream { render turbo_stream: turbo_stream.replace("comment_form", partial: "comments/form", locals: { post: @post, comment: @comment }), status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/:post_id/comments/:id
  def destroy
    @comment = @post.comments.find(params[:id])
    @comment.destroy!

    respond_to do |format|
      format.html { redirect_to @post, notice: "Comment was successfully destroyed." }
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@comment) }
    end
  end

  private
    def set_post
      @post = Post.find(params[:post_id])
    end

    def comment_params
      params.require(:comment).permit(:body, :user_id)
    end
end
