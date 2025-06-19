// routes/productFeedbackRoutes.js
const express = require("express");
const router = express.Router();
const productFeedbackController = require("../../../controllers/UserControllers/productFeedbackController/productFeedbackController");
const handleImageUploads = require("../../../middleware/Media/ImageUpload");

router.post(
  "/add",
  handleImageUploads([
    { name: "productImage", folder: "product-feedback", transformation: { width: 500, crop: "scale" } },
    { name: "additionalPhotos", folder: "product-feedback", transformation: { width: 800, crop: "scale" } },
  ]),
  productFeedbackController.createFeedback
);

router.get("/", productFeedbackController.getAllFeedback);


// GET feedbacks by seller email
router.get("/seller/:sellerEmail", productFeedbackController.getFeedbackBySellerEmail);


module.exports = router;
