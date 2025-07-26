class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to posts_path, notice: "Account created successfully! You can now comment on posts using your name: #{@user.name}" }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :email)
    end
end
