const express = require("express");
const router = express.Router();
const bannerController = require("../../../controllers/AdminControllers/ManageSellersControllers/TASKS/BannerController");
const handleImageUploads = require("../../../middleware/Media/ImageUpload");

// Configure image upload middleware specifically for banners
const uploadBannerImage = handleImageUploads([
  {
    name: "image",
    folder: "banners",
    transformation: { width: 1200, height: 400, crop: "fill" },
  },
]);

// GET /api/banners - Get all banners
router.get("/", bannerController.getAllBanners);

// POST /api/banners - Create new banner (admin only)
router.post("/", uploadBannerImage, bannerController.createBanner);

// PATCH /api/banners/:id - Update banner status (admin only)
router.patch("/:id", bannerController.updateBannerStatus);

// DELETE /api/banners/:id - Delete banner (admin only)
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
