const SellerModel = require("../../../models/LoginSchema/seller");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address = "",
      phoneNo = "",
      gender = "",
      alternativePhoneNo = "",
      city = "",
      state = "",
      pinCode = "",
      country = "",
    } = req.body;

    console.log("Request body:", req.body);

    // Check if user already exists
    const existUser = await SellerModel.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    console.log("User does not exist, proceeding to register.");

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    // Create new user with isVerified: false
    const newUser = new SellerModel({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNo,
      gender,
      alternativePhoneNo,
      city,
      state,
      pinCode,
      country,
      isVerified: false, // Explicitly set verification status
    });

    // Save the new user
    await newUser.save();
    console.log("User registered successfully:", newUser);

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRETE,
      { expiresIn: "1h" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: false,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 3600000,
      sameSite: "None",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      newUser: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified, // Include verification status
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error("Email and password are required");
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await SellerModel.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password for user:", email);
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRETE,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: false,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 3600000,
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        isVerified: user.isVerified, // Changed from 'verified' to 'isVerified'
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
};

// authController.js
const Logout = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
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
};

module.exports = {
  register,
  Login,
  Logout,
};
