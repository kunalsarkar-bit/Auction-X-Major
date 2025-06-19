const express = require("express");
const router = express.Router();
const {
  getAllSellers,
  getSellerDetails,
  updateSellerStatus,
  verifySeller,
  getSellerStats,
} = require("../../controllers/AdminControllers/RANDOM/ManageSellerAccountsController");

// Get all sellers with pagination and filters
router.get("/", getAllSellers);

// Get seller statistics for dashboard
router.get("/stats", getSellerStats);

// Get single seller details
router.get("/:sellerId", getSellerDetails);

// Update seller status
router.put("/:sellerId/status", updateSellerStatus);

// Verify seller
router.put("/:sellerId/verify", verifySeller);

module.exports = router;
