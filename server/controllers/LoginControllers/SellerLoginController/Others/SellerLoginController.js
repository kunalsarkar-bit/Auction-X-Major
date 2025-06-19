const Seller = require("../../../../models/LoginSchema/seller");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sellerController = {
  // Register a new seller
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        address = "",
        phoneNumber = "",
        gender = "",
        alternativePhoneNumber = "",
        city = "",
        state = "",
        pinCode = "",
        storeName = "",
        storeDescription = "",
      } = req.body;

      console.log("Request body:", req.body);

      // Check if seller already exists
      const existingSeller = await Seller.findOne({ email });
      if (existingSeller) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Seller with this email already exists",
          });
      }

      console.log("Seller does not exist, proceeding to register.");

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");

      // Create new seller
      const newSeller = new Seller({
        name,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        gender,
        alternativePhoneNumber,
        city,
        state,
        pinCode,
        storeName,
        storeDescription,
        isVerified: false, // Set as verified by default (no email verification)
        isNewUser: true,
      });

      // Save the new seller
      await newSeller.save();
      console.log("Seller registered successfully:", newSeller._id);

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: newSeller._id,
          email: newSeller.email,
          name: newSeller.name,
          role: newSeller.role,
        },
        process.env.JWT_SECRET, // Make sure to use your actual JWT secret key
        { expiresIn: "24h" } // Token valid for 24 hours
      );

      // Set the token in an HTTP-only cookie
      res.cookie("seller_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "Strict",
      });

      // Return success response
      res.status(201).json({
        success: true,
        message: "Seller registered successfully",
        token,
        seller: {
          id: newSeller._id,
          name: newSeller.name,
          email: newSeller.email,
          role: newSeller.role,
          storeName: newSeller.storeName,
          isVerified: newSeller.isVerified,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // Login seller
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        console.error("Email and password are required");
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }

      // Find seller
      const seller = await Seller.findOne({ email });
      if (!seller) {
        console.error("Seller not found for email:", email);
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, seller.password);
      if (!isPasswordValid) {
        console.error("Invalid password for seller:", email);
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Check if account is verified - optional since we're skipping verification
      // Keeping this check in case you decide to enable verification in the future
      if (!seller.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Account is not verified. Please contact support.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: seller._id,
          email: seller.email,
          name: seller.name,
          role: seller.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set cookie with token
      res.cookie("seller_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "Strict",
      });

      // Return success response with seller info
      return res.status(200).json({
        success: true,
        message: "Login successful",
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          profilePic: seller.profilePic,
          role: seller.role,
          isNewUser: seller.isNewUser,
          isVerified: seller.isVerified,
          storeName: seller.storeName,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Logout seller
  logout: async (req, res) => {
    try {
      // Clear the HTTP-only cookie
      res.clearCookie("seller_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
module.exports = sellerController;
