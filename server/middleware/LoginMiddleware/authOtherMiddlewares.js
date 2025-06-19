const jwt = require("jsonwebtoken");
const UserModel = require("../../models/LoginSchema/user");
const SellerModel = require("../../models/LoginSchema/seller");
const bcrypt = require("bcrypt");

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: User is not an admin" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if the user is authenticated
const IsUser = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    console.log("Token being verified:", token); // Debug token

    // ✅ FIXED: Typo in environment variable key
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    return next(); // ✅ Added return for consistency
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// Middleware to check if the user is authenticated
const IsSeller = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    console.log("Token being verified:", token); // Debug token

    // ✅ FIXED: Typo in environment variable key
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    const user = await SellerModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    return next(); // ✅ Added return for consistency
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// Middleware to check if the user is authenticated via Google
const IsGUser = (req, res, next) => {
  const token = req.cookies.token; // Read token from cookies
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRETE, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach decoded user info to the request
    req.user = decoded;
    next();
  });
};

// Middleware to check if a user exists by email
const checkUserByEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Check User By Email Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Middleware to check if a user exists by email
const checkSellerByEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await SellerModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Check User By Email Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Middleware to update user password
const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = req.user; // Retrieved from the previous middleware

  // Log the request body to check what's being sent
  console.log("Request body:", req.body);
  console.log("New password:", newPassword);

  try {
    // Check if newPassword is valid
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  isAdmin,
  IsUser,
  IsSeller,
  IsGUser,
  checkUserByEmail,
  checkSellerByEmail,
  updatePassword,
};
