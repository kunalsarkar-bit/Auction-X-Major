const jwt = require("jsonwebtoken");
const Admin = require("../../models/AdminModels/SETTINGS/MY-ACCOUNT/Admin");

// Named middleware function
const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (
      admin.passwordChangedAt &&
      decoded.iat < admin.passwordChangedAt.getTime() / 1000
    ) {
      return res
        .status(401)
        .json({ message: "Password recently changed, please login again" });
    }

    req.userId = decoded.id;
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    console.error("Admin auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminAuthMiddleware;
