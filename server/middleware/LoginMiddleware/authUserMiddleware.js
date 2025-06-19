// /middleware/LoginMiddleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../../models/LoginSchema/user");

const authUserMiddleware = async (req, res, next) => {
  try {
    let token;

    // ✅ First: Try to get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ✅ Fallback: Check if token is sent in Authorization header
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ✅ If no token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    // ✅ Find user by email (or use ID if token contains it)
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = authUserMiddleware;
