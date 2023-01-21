# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_01_21_084012) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "user_accounts", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_login_data", force: :cascade do |t|
    t.bigint "user_account_id", null: false
    t.string "login_name"
    t.string "password_digest"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_account_id"], name: "index_user_login_data_on_user_account_id"
  end

  create_table "vehicle_histories", force: :cascade do |t|
    t.bigint "vehicle_profile_id", null: false
    t.datetime "date"
    t.string "description"
    t.integer "odometer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "category_id"
    t.json "extras"
    t.index ["category_id"], name: "index_vehicle_histories_on_category_id"
    t.index ["vehicle_profile_id"], name: "index_vehicle_histories_on_vehicle_profile_id"
  end

  create_table "vehicle_history_categories", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "vehicle_profiles", force: :cascade do |t|
    t.bigint "user_account_id", null: false
    t.string "type"
    t.string "make"
    t.string "model"
    t.string "year"
    t.string "body"
    t.integer "odometer"
    t.json "other"
    t.json "history_types_list"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_account_id"], name: "index_vehicle_profiles_on_user_account_id"
  end

  add_foreign_key "user_login_data", "user_accounts"
  add_foreign_key "vehicle_histories", "vehicle_history_categories", column: "category_id"
  add_foreign_key "vehicle_histories", "vehicle_profiles"
  add_foreign_key "vehicle_profiles", "user_accounts"
end
