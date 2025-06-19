const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/AdminControllers/AdminLoginController/SETTINGS/AdminProfileController");
const { avatar } = require("../../../middleware/Media/ImageUploadAdmin");
const adminAuthMiddleware = require("../../../middleware/LoginMiddleware/authAdminMiddleware");
// const adminAuthMiddleware = require("../../middleware/LoginMiddleware/authMiddleware");

// Profile routes
router.get("/profile", adminAuthMiddleware, userController.getProfile);
router.put("/profile", adminAuthMiddleware, userController.updateProfile);
router.post(
  "/profile/upload-pic",
  adminAuthMiddleware,
  avatar,
  userController.uploadProfilePic
);

// Password routes
router.put(
  "/change-password",
  adminAuthMiddleware,
  userController.updatePassword
);

// Verification route (admin only)
router.put("/verify/:id", adminAuthMiddleware, userController.verifyUser);

// Notification preferences routes
router.get(
  "/notifications",
  adminAuthMiddleware,
  userController.getNotificationPreferences
);
router.put(
  "/notifications",
  adminAuthMiddleware,
  userController.updateNotificationPreferences
);

// Activity logs routes
router.get(
  "/activity-logs",
  adminAuthMiddleware,
  userController.getActivityLogs
);
router.get(
  "/activity-logs/download",
  adminAuthMiddleware,
  userController.downloadActivityReport
);

// Admin-only routes
router.put(
  "/update-amount",
  adminAuthMiddleware,
  userController.updateUserAmount
);

module.exports = router;
