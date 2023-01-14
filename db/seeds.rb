# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

pp "SEEDING"

ua1 = UserAccount.create(first_name: "brian", last_name: "lambert")
ul1= UserLoginDatum.create(user_account: ua1, email: "brian@email.com", login_name: "brian", password: "password123")


vp = VehicleProfile.create(user_account: ua1, make: "Nissan", model: "180sx", year: "1996")

pp "SEEDING FINISHED"