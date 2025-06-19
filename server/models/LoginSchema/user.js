const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: function () {
        return !this.isNewUser; // Password is required only for non-OAuth users
      },
    },
    address: {
      type: String,
      default: "",
    },
    phoneNo: {
      type: String,
      default: "",
    },
    alternativePhoneNo: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    pinCode: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    isNewUser: {
      // New field to check if user is new
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
      required: false,
    },
    isVerified: {
      // New field to check if user is new
      type: Boolean,
      default: false,
    },
    profilePic: [
      {
        secure_url: { type: String, required: false },
        public_id: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model already exists
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Export the model
module.exports = UserModel;
