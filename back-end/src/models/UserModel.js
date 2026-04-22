const mongoose = require("mongoose");
const userSechma = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSechma);
module.exports = User;
