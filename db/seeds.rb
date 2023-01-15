# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


require 'date'

current_time = DateTime.now

current_time.next_month.strftime "%Y-%m-%d %H:%M"


pp "SEEDING"

# vehicle history categories
vhc1 = VehicleHistoryCategory.create(name: "Service", description: "Regular maintainence/servicing")
vhc2 = VehicleHistoryCategory.create(name: "Upgrade", description: "Replaced part with better quality/performance part")
VehicleHistoryCategory.create(name: "Repair", description: "Fixed an item on vehicle")
VehicleHistoryCategory.create(name: "Other", description: "Custom property")


#  User account 1
ua1 = UserAccount.create(first_name: "brian", last_name: "lambert")
ul1= UserLoginDatum.create(user_account: ua1, email: "brian@email.com", login_name: "brian", password: "password123")

#  vehicle profile 1
vp1 = VehicleProfile.create(user_account: ua1, make: "Nissan", model: "180sx", year: "1996")
# Vehicle history 1
VehicleHistory.create(vehicle_profile: vp1, category: vhc1, description: "General checkup, topped up fluids", date: current_time)

11.times do |i|
    VehicleHistory.create(vehicle_profile: vp1, category: vhc1, description: "General checkup, topped up fluids", date: current_time)
end


#  User account 2
ua2 = UserAccount.create(first_name: "robert", last_name: "lambert")
ul2= UserLoginDatum.create(user_account: ua2, email: "robert@email.com", login_name: "robert", password: "password123")

#  vehicle profile 1
vp2 = VehicleProfile.create(user_account: ua2, make: "Nissan", model: "R34 Skyline", year: "1998")
# Vehicle history 1
VehicleHistory.create(vehicle_profile: vp2, category: vhc2, description: "New exhaust", date: current_time)



#  vehicle profile 1
vp1 = VehicleProfile.create(user_account: ua1, make: "Toyota", model: "Supra", year: "1994")

pp "SEEDING FINISHED"