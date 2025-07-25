# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data
Comment.destroy_all
Post.destroy_all
User.destroy_all

puts "Seeding users>>>"
users = User.create!([
  { name: "Akello Siduwa", email: "akellosiduwa@gmail.com" },
  { name: "Mudiera Oyieri", email: "mudieraoyieri@gmail.com" },
  { name: "Okotch K'Oundo", email: "okotchkoundo@gmail.com" }
])

puts "Seeding posts>>>"
posts = users.map do |user|
  Post.create!(
    title: "#{user.name}'s first post",
    body: "This is the body of the post by #{user.name}.",
    user: user
  )
end

puts "Seeding  comments>>>"
posts.each do |post|
  2.times do
    Comment.create!(
      body: "Nice post, #{post.user.name.split.first}!",
      user: users.sample,
      post: post
    )
  end
end

puts "Seeding complete!"
