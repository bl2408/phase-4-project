# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


require 'date'

@t = Time.current - 1.months

pp DateTime.now
pp @t

def current_time
    @t = @t + rand(10).minutes + rand(3).days
    @t.strftime "%Y-%m-%d %H:%M"
end



pp "SEEDING"

# vehicle history categories
vhc1 = VehicleHistoryCategory.create(name: "Service", description: "Regular maintainence/servicing")
vhc2 = VehicleHistoryCategory.create(name: "Upgrade", description: "Replaced part with better quality/performance part")
vhc3 = VehicleHistoryCategory.create(name: "Repair", description: "Fixed an item on vehicle")
vhc4 = VehicleHistoryCategory.create(name: "Other", description: "Custom property")

#tags
tag1 = Tag.create(name: "Important")
tag2 = Tag.create(name: "Milestone")
tag3 = Tag.create(name: "Purchase")
tag4 = Tag.create(name: "Noise")



#  User account 1
ua1 = UserAccount.create(first_name: "brian", last_name: "lambert")
ul1= UserLoginDatum.create(user_account: ua1, email: "brian@email.com", login_name: "brian", password: "password123")

#  vehicle profile 1
vp1 = VehicleProfile.create(user_account: ua1, make: "Nissan", model: "180sx", year: "1996", odometer: 100, body: "coupe", vehicle_type:"vehicle")

# Vehicle history 1
vh1 = VehicleHistory.create(vehicle_profile: vp1, category: vhc4, description: "Purchased car", date: current_time, odometer: 100000)

HistoryTag.create(vehicle_history: vh1, tag: tag1)
HistoryTag.create(vehicle_history: vh1, tag: tag2)
HistoryTag.create(vehicle_history: vh1, tag: tag3)

VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc1, 
    description: "General checkup, topped up fluids", 
    date: current_time, 
    odometer: 100000
)
VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc2, 
    description: "Installed new exhaust", 
    date: current_time, 
    odometer: 100500
)
vh2 = VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc3, 
    description: "Fixed damage on front driver's side quarter panel", 
    date: current_time, 
    odometer: 101000
)
HistoryTag.create(vehicle_history: vh2, tag: tag1)
vh3 = VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc4, 
    description: "Heard noise coming from rear subframe", 
    date: current_time, 
    odometer: 102000
)
HistoryTag.create(vehicle_history: vh3, tag: tag4)

vh4 = VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc4, 
    description: "Noise from rear subframe getting louder", 
    date: current_time, 
    odometer: 103000
)
HistoryTag.create(vehicle_history: vh4, tag: tag4)

VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc3, 
    description: "Installed new rear subframe bushes", 
    date: current_time, 
    odometer: 104000
)
VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc2, 
    description: "New rims", 
    date: current_time, 
    odometer: 104000
)
VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc2, 
    description: "New wheel nuts", 
    date: current_time, 
    odometer: 104000
)
vh5 = VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc1, 
    description: "Full service of fluids and brake pads", 
    date: current_time, 
    odometer: 110000
)
HistoryTag.create(vehicle_history: vh5, tag: tag1)
HistoryTag.create(vehicle_history: vh5, tag: tag2)

VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc3, 
    description: "Fixed broken headlight", 
    date: current_time, 
    odometer: 114000
)
VehicleHistory.create(
    vehicle_profile: vp1, 
    category: vhc2, 
    description: "New coilovers", 
    date: current_time, 
    odometer: 115000
)


#  User account 2
ua2 = UserAccount.create(first_name: "robert", last_name: "lambert")
ul2= UserLoginDatum.create(user_account: ua2, email: "robert@email.com", login_name: "robert", password: "password123")

#  vehicle profile 1
vp2 = VehicleProfile.create(user_account: ua2, make: "Nissan", model: "R34 Skyline", year: "1998", odometer: 2000, body: "coupe", vehicle_type:"vehicle")
# Vehicle history 1
VehicleHistory.create(vehicle_profile: vp2, category: vhc2, description: "New exhaust", date: current_time, odometer: 3000)



#  vehicle profile 1
vp1 = VehicleProfile.create(user_account: ua1, make: "Toyota", model: "Supra", year: "1994", odometer:10000, body: "coupe", vehicle_type:"vehicle")

pp "SEEDING FINISHED"