const Seller = require("../../../../models/LoginSchema/seller");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sellerController = {
  // Get current seller profile (protected route)
  getProfile: async (req, res) => {
    try {
      // req.seller is set by the auth middleware
      const seller = await Seller.findById(req.seller.id).select("-password");

      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while retrieving seller profile",
      });
    }
  },

  // Verify email
  updateSellerProfile: async (req, res) => {
    try {
      const sellerId = req.seller.id; // Assuming you have authentication middleware that sets req.seller

      // Fields that can be updated
      const {
        name,
        address,
        phoneNumber,
        alternativePhoneNumber,
        gender,
        city,
        state,
        pinCode,
        storeName,
        storeDescription,
      } = req.body;

      // Find the seller by ID
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Update seller information if provided
      if (name) seller.name = name;
      if (address) seller.address = address;
      if (phoneNumber) seller.phoneNumber = phoneNumber;
      if (alternativePhoneNumber)
        seller.alternativePhoneNumber = alternativePhoneNumber;
      if (gender) seller.gender = gender;
      if (city) seller.city = city;
      if (state) seller.state = state;
      if (pinCode) seller.pinCode = pinCode;
      if (storeName) seller.storeName = storeName;
      if (storeDescription) seller.storeDescription = storeDescription;

      // If this is the first time updating profile, change isNewUser to false
      // if (seller.isNewUser) {
      //   seller.isNewUser = false;
      // }

      // Save the updated seller
      await seller.save();

      // Return updated seller information
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          address: seller.address,
          phoneNumber: seller.phoneNumber,
          alternativePhoneNumber: seller.alternativePhoneNumber,
          gender: seller.gender,
          city: seller.city,
          state: seller.state,
          pinCode: seller.pinCode,
          storeName: seller.storeName,
          storeDescription: seller.storeDescription,
          isNewUser: seller.isNewUser,
          profilePic: seller.profilePic,
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

  // Update password
  updatePassword: async (req, res) => {
    try {
      const sellerId = req.seller.id;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide current password and new password",
        });
      }

      // Find seller
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller not found",
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        seller.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      seller.password = hashedPassword;
      await seller.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating password",
      });
    }
  },
};

module.exports = sellerController;
