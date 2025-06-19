const UserModel = require("../../../models/LoginSchema/user.js");
const Otp = require("../../../models/LoginSchema/otp.js"); // Updated OTP model
const sendOtpEmail = require("../../../utlis/Others/emailSender.js"); // Assuming you have a utility for sending emails
const jwt = require("jsonwebtoken");

const CheckUser = async (req, res) => {
  try {
    const user = req.user; // Access the authenticated user
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Added return here
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Check User Error:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "Not authenticated",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    // Return user info without the token
    return res.status(200).json({
      authenticated: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(401).json({
      authenticated: false,
      message: "Invalid token",
    });
  }
};

const verifyNormalUser = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user by email and update 'isvarified' to true
    const user = await UserModel.findOneAndUpdate(
      { email: email },
      { isVerified: true },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      phoneNo,
      gender,
      profilePic,
      alternativePhoneNo,
      city,
      state,
      pinCode,
      country,
    } = req.body;
    const userId = req.user._id; // Get the user from the request object

    // Update user information
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        address,
        phoneNo,
        gender,
        profilePic: profilePic || [], // Ensure profilePic is an array
        alternativePhoneNo,
        city,
        state,
        pinCode,
        country,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateGProfile = async (req, res) => {
  try {
    const {
      address,
      phoneNo,
      gender,
      alternativePhoneNo,
      city,
      state,
      pinCode,
      country,
    } = req.body;
    const userEmail = req.user.email; // Get the user email from the authenticated user

    // Update the user's address, phoneNo, and gender based on email
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userEmail }, // Find user by email
      {
        address,
        phoneNo,
        gender,
        alternativePhoneNo,
        city,
        state,
        pinCode,
        country,
      },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999

    // Create and save OTP entry in the database
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendOtpEmail(email, otp); // Assuming sendOtpEmail is your email sending logic

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// In your verifyOtp backend function:
const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    if (typeof otp === "string") {
      otp = parseInt(otp, 10);
    }

    const otpEntry = await Otp.findOne({ email });

    console.log("OTP Entry:", otpEntry);
    console.log("Received OTP:", otp, "Type:", typeof otp);
    console.log("Stored OTP:", otpEntry?.otp, "Type:", typeof otpEntry?.otp);

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (otpEntry.otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        debug: {
          received: otp,
          stored: otpEntry.otp,
        },
      });
    }

    // Update user verification status
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    await Otp.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      isVerified: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// Controller to get the OTP
const getOtp = async (req, res) => {
  const { email } = req.params;

  try {
    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found" });
    }

    res.status(200).json({ otp: otpEntry.otp });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving OTP", error: error.message });
  }
};
const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const newOtp = Math.floor(1000 + Math.random() * 9000);
    await Otp.findOneAndUpdate(
      { email },
      { otp: newOtp },
      { new: true, upsert: true }
    );
    await sendOtpEmail(email, newOtp);
    res.status(200).json({ message: "OTP resent successfully", otp: newOtp });
  } catch (error) {
    console.error("Error in resendOtp:", error.message);
    res
      .status(500)
      .json({ message: "Failed to resend OTP. Please try again." });
  }
};

const checkAdminByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Using UserModel instead of User
    const user = await UserModel.findOne({ email }).select("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isAdmin = user.role === "admin";

    return res.status(200).json({
      success: true,
      isAdmin,
      message: isAdmin ? "User is admin" : "User is not admin",
      role: user.role, // Explicitly returning the role
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message, // Only include in development
    });
  }
};

module.exports = {
  CheckUser,
  updateProfile,
  updateGProfile,
  sendOtp,
  getOtp,
  resendOtp,
  verifyOtp,
  verifyNormalUser,
  checkAuth,
  checkAdminByEmail,
};
