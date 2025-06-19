const express = require("express");
const router = express.Router();
const notificationController = require("../../../controllers/AdminControllers/AdminLoginController/SETTINGS/AdminNotificationController");

router
  .route("/")
  .get(notificationController.getNotifications)
  .post(notificationController.createNotification);

router.route("/:id/read").patch(notificationController.markAsRead);

router.route("/:id").delete(notificationController.deleteNotification);

module.exports = router;
