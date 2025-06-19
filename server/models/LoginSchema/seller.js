const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: function () {
        return !this.isNewUser; // Password is required only for non-OAuth users
      },
    },
    role: {
      type: String,
      enum: ["admin", "seller"],
      default: "seller",
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: [
      {
        secure_url: { type: String, required: false },
        public_id: { type: String, required: false },
      },
    ],
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
    pinCode: {
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
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    storeName: {
      type: String,
      default: "",
    },
    storeDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
