const Seller = require("../../../../models/LoginSchema/seller");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sellerController = {
  updateProfile: async (req, res) => {
    try {
      const sellerId = req.seller.id; // From auth middleware

      const {
        name,
        address,
        phoneNumber,
        pinCode,
        state,
        city,
        alternativePhoneNumber,
        gender,
        storeName,
        storeDescription,
      } = req.body;

      // Find the seller
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Update fields if provided
      if (name) seller.name = name;
      if (address) seller.address = address;
      if (phoneNumber) seller.phoneNumber = phoneNumber;
      if (pinCode) seller.pinCode = pinCode;
      if (state) seller.state = state;
      if (city) seller.city = city;
      if (alternativePhoneNumber)
        seller.alternativePhoneNumber = alternativePhoneNumber;
      if (gender) seller.gender = gender;
      if (storeName) seller.storeName = storeName;
      if (storeDescription) seller.storeDescription = storeDescription;

      // If this is the first time completing the profile, mark as not new user
      // if (seller.isNewUser) {
      //   seller.isNewUser = false;
      // }

      await seller.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          address: seller.address,
          phoneNumber: seller.phoneNumber,
          pinCode: seller.pinCode,
          state: seller.state,
          city: seller.city,
          alternativePhoneNumber: seller.alternativePhoneNumber,
          gender: seller.gender,
          storeName: seller.storeName,
          storeDescription: seller.storeDescription,
          isNewUser: seller.isNewUser,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
      });
    }
  },

  // Update profile picture
  updateProfilePicture: async (req, res) => {
    try {
      const sellerId = req.seller.id;
      const { secure_url, public_id } = req.body;

      if (!secure_url || !public_id) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide secure_url and public_id for the profile picture",
        });
      }

      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Add new profile picture
      seller.profilePic = [{ secure_url, public_id }];
      await seller.save();

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        profilePic: seller.profilePic,
      });
    } catch (error) {
      console.error("Update profile picture error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile picture",
      });
    }
  },
};

module.exports = sellerController;
