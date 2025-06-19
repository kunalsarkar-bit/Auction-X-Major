const express = require("express");
const router = express.Router();

/////////////////////////////////////////////-CUSTOMER-ROUTES-/////////////////////////////////////////////

const customerController = require("../../controllers/AdminControllers/ManageUsersControllers/E-COMMERCE/ManageUserCustomerController");

// Get all customers ✅
router.get("/customers", customerController.getAllCustomers);

// Get a single customer by ID
router.get("/customers/:id", customerController.getCustomerById);

// Update a customer by ID
router.put("/customers/:id", customerController.updateCustomer);

// Delete a customer by ID
router.delete("/customers/:id", customerController.deleteCustomer);

// Add this route for bulk delete
router.delete("/customers", customerController.deleteMultipleCustomers);

/////////////////////////////////////////////-INVENTORY-ROUTES-/////////////////////////////////////////////

const itemController = require("../../controllers/AdminControllers/ManageUsersControllers/E-COMMERCE/ManageUserInventoryController");

// Get all items
router.get("/items", itemController.getItems);

// Get a single item by ID
router.get("/items/:id", itemController.getItemById);

// Add a new item
router.post("/items", itemController.addItem);

// Update an item
router.put("/items/:id", itemController.updateItem);

// Delete an item
router.delete("/items/:id", itemController.deleteItem);

// Delete multiple items
router.delete("/items", itemController.deleteMultipleItems);

/////////////////////////////////////////////-ORDER-ROUTES-/////////////////////////////////////////////

const orderController = require("../../controllers/AdminControllers/ManageUsersControllers/E-COMMERCE/ManageUserOrderController");

// Get all orders with pagination
router.get("/", orderController.getOrders);

// Get a single order by ID
router.get("/:id", orderController.getOrderById);

// Add a new order
router.post("/", orderController.addOrder);

// Update an order
router.put("/:id", orderController.updateOrder);

// Delete an order
router.delete("/:id", orderController.deleteOrder);

// Delete multiple orders
router.delete("/", orderController.deleteMultipleOrders);

/////////////////////////////////////////////-SUBSCRIPTION-ROUTES-/////////////////////////////////////////////

const subscriptionController = require("../../controllers/AdminControllers/OthersControllers/FINANCE/SubscriptionController");
// const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require("express-validator");

// @route   GET /api/subscriptions
// @desc    Get all subscriptions
// @access  Private/Admin
router.get("/subscriptions", subscriptionController.getSubscriptions);

// @route   GET /api/subscriptions/:id
// @desc    Get single subscription
// @access  Private/Admin or Subscription Owner
router.get("/subscriptions/:id", subscriptionController.getSubscription);

// @route   POST /api/subscriptions
// @desc    Create new subscription
// @access  Private/Admin
router.post(
  "/subscriptions",
  [
    check("planName", "Plan name is required").not().isEmpty(),
    check("userEmail", "Please include a valid email").isEmail(),
    check("status", "Status is required").not().isEmpty(),
    check("endDate", "End date is required").not().isEmpty(),
    check("price", "Price must be a positive number").isFloat({ min: 0 }),
    check("userId", "User ID is required").not().isEmpty(),
  ],
  subscriptionController.createSubscription
);

// @route   PUT /api/subscriptions/:id
// @desc    Update subscription
// @access  Private/Admin or Subscription Owner
router.put("/subscriptions/:id", subscriptionController.updateSubscription);

// @route   PUT /api/subscriptions/:id/cancel
// @desc    Cancel subscription
// @access  Private/Admin or Subscription Owner
router.put(
  "/subscriptions/:id/cancel",
  subscriptionController.cancelSubscription
);

// @route   DELETE /api/subscriptions/:id
// @desc    Delete subscription
// @access  Private/Admin
router.delete("/subscriptions/:id", subscriptionController.deleteSubscription);

/////////////////////////////////////////////-TRANSACTION-ROUTES-/////////////////////////////////////////////

const {
  getTransactions,
  getTransaction,
  createTransaction,
  getTransactionsByType,
} = require("../../controllers/AdminControllers/OthersControllers/FINANCE/TransactionController");

router.route("/").get(getTransactions).post(createTransaction);
router.get("/type/:type", getTransactionsByType);
router.route("/:id").get(getTransaction);
// .put(protect, updateTransaction)
// .delete(protect, deleteTransaction);

/////////////////////////////////////////////-FEEDBACK-ROUTES-/////////////////////////////////////////////

const feedbackController = require("../../controllers/AdminControllers/OthersControllers/ManageUserFeedbackController");

// Feedback routes
router.get("/feedbacks", feedbackController.getAllFeedbacks);
router.get("/feedbacks/:id", feedbackController.getFeedbackById);
router.post("/feedbacks", feedbackController.addFeedback);
router.put("/feedbacks/:id", feedbackController.updateFeedback);
router.delete("/feedbacks/:id", feedbackController.deleteFeedback);

/////////////////////////////////////////////-REPORT-ROUTES-/////////////////////////////////////////////

const reportController = require("../../controllers/AdminControllers/OthersControllers/ManageUserReportController");

// Get all reports
router.get("/reports", reportController.getAllReports);

// Get a single report by ID
router.get("/reports/:id", reportController.getReportById);

// Create a new report
router.post("/reports", reportController.createReport);

// Update a report
router.put("/reports/:id", reportController.updateReport);

// Delete a report
router.delete("/reports/:id", reportController.deleteReport);

/////////////////////////////////////////////-ADMIN-PROFILE-ROUTES-/////////////////////////////////////////////

const userController = require("../../controllers/AdminControllers/AdminLoginController/SETTINGS/AdminProfileController");
const { avatar } = require("../../middleware/Media/ImageUploadAdmin");
const adminAuthMiddleware = require("../../middleware/LoginMiddleware/authAdminMiddleware");

// Profile routes
router.get(
  "/adminProfile/profile",
  adminAuthMiddleware,
  userController.getProfile
);
router.put(
  "/adminProfile/profile",
  adminAuthMiddleware,
  userController.updateProfile
);
router.post(
  "/adminProfile/profile/upload-pic",
  adminAuthMiddleware,
  avatar,
  userController.uploadProfilePic
);

// Password routes
router.put(
  "/adminProfile/change-password",
  adminAuthMiddleware,
  userController.updatePassword
);

// Verification route (admin only)
router.put(
  "/adminProfile/verify/:id",
  adminAuthMiddleware,
  userController.verifyUser
);

// Notification preferences routes
router.get(
  "/adminProfile/notifications",
  adminAuthMiddleware,
  userController.getNotificationPreferences
);
router.put(
  "/adminProfile/notifications",
  adminAuthMiddleware,
  userController.updateNotificationPreferences
);

// Activity logs routes
router.get(
  "/adminProfile/activity-logs",
  adminAuthMiddleware,
  userController.getActivityLogs
);
router.get(
  "/adminProfile/activity-logs/download",
  adminAuthMiddleware,
  userController.downloadActivityReport
);

// Admin-only routes
router.put(
  "/adminProfile/update-amount",
  adminAuthMiddleware,
  userController.updateUserAmount
);

/////////////////////////////////////////////-BANNER-ROUTES-/////////////////////////////////////////////
const bannerController = require("../../controllers/AdminControllers/ManageSellersControllers/TASKS/BannerController");
const handleImageUploads = require("../../middleware/Media/ImageUpload");

// Configure image upload middleware specifically for banners
const uploadBannerImage = handleImageUploads([
  {
    name: "image",
    folder: "banners",
    transformation: { width: 1200, height: 400, crop: "fill" },
  },
]);

// GET /api/banners - Get all banners
router.get("/banners", bannerController.getAllBanners);

// POST /api/banners - Create new banner (admin only)
router.post("/banners", uploadBannerImage, bannerController.createBanner);

// PATCH /api/banners/:id - Update banner status (admin only)
router.patch("/banners/:id", bannerController.updateBannerStatus);

// DELETE /api/banners/:id - Delete banner (admin only)
router.delete("/banners/:id", bannerController.deleteBanner);

/////////////////////////////////////////////-EVENTS-ROUTES-/////////////////////////////////////////////

const eventController = require("../../controllers/AdminControllers/ManageSellersControllers/TASKS/EventController");

// GET /api/events - Get all events
router.get("/events", eventController.getAllEvents);

// POST /api/events - Create new event
router.post("/events", eventController.createEvent);

// GET /api/events/:id - Get single event
router.get("/events/:id", eventController.getEventById);

// PUT /api/events/:id - Update event
router.put("/events/:id", eventController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete("/events/:id", eventController.deleteEvent);

/////////////////////////////////////////////-CALENDER-ROUTES-/////////////////////////////////////////////

const calendarController = require("../../controllers/AdminControllers/ManageSellersControllers/TASKS/CalendarController");

// Create a new calendar entry
router.post("/calendar", calendarController.createCalendarEntry);

// Get all calendar entries
router.get("/calendar", calendarController.getAllCalendarEntries);

// Get calendar entries for a specific date
router.get("/calendar/date/:date", async (req, res) => {
  try {
    if (!calendarController.isValidDate(req.params.date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const entries = await Calendar.find({
      date: new Date(req.params.date),
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error("Error fetching entries by date:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching entries by date",
    });
  }
});

/////////////////////////////////////////////-NOTIFICATION-ROUTES-/////////////////////////////////////////////

const notificationController = require("../../controllers/AdminControllers/AdminLoginController/SETTINGS/AdminNotificationController");

router
  .route("/notifications")
  .get(notificationController.getNotifications)
  .post(notificationController.createNotification);

router
  .route("/notifications/:id/read")
  .patch(notificationController.markAsRead);

router
  .route("/notifications/:id")
  .delete(notificationController.deleteNotification);

/////////////////////////////////////////////-SELLER-ROUTES-/////////////////////////////////////////////

const sellerController = require("../../controllers/AdminControllers/ManageSellersControllers/SELLER-MANAGEMENT/SellerController");

// Seller management routes
router.get("/sellers", sellerController.getAllSellers); // Get all sellers with pagination
router.get("/sellers/stats", sellerController.getSellerStats); // Get seller statistics
router.get("/sellers/:id", sellerController.getSeller); // Get single seller details
router.patch("/sellers/:id/status", sellerController.updateStatus); // Update seller status
router.patch("/sellers/:id/verify", sellerController.verifySeller); // Verify seller

// Get seller transaction history with pagination
router.get("/sellers/history", sellerController.getSellerHistory);

// Get single transaction details
router.get("/sellers/history/:id", sellerController.getTransactionDetails);

module.exports = router;
