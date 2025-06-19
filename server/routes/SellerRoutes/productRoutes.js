const express = require("express");
const productRoutes = express.Router();
const {
  createProduct,
  patchProduct,
  updateProductStatus,
  deleteSuccessProduct,
  getAllProducts,
  getProductsByEmail,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  deleteImage,
  submitFeedback,
} = require("../../controllers/SellerControllers/SellerProductController/productController");

const checkTimeRestriction = require("../../middleware/SellAnItemMiddleware/checkTimeRestriction");
const {
  handleImageUploads,
} = require("../../middleware/Media/cloudinaryMiddleware");
const handleContactSubmission = require("../../utlis/Others/ContactUsEmailSender");

//-------------------Product-------------------//

// POST endpoint to create a product
productRoutes.post("/", handleImageUploads, createProduct);

// GET endpoint to get all products
productRoutes.get("/", getAllProducts);

// GET endpoint to get a product by EMAIL
productRoutes.get("/email/:email", getProductsByEmail);

// GET endpoint to get a product by ID
productRoutes.get("/:id", getProductById);

productRoutes.get("/category/:category", getProductsByCategory);

// PUT endpoint to update a product by ID
productRoutes.put(
  "/:id",
  checkTimeRestriction,
  handleImageUploads,
  updateProduct
);

//status update
productRoutes.patch("/statuspatch/:id", updateProductStatus);

// DELETE endpoint to delete a product by ID
productRoutes.delete("/:id", checkTimeRestriction, deleteProduct);

productRoutes.delete("/delete-multiple", deleteMultipleProducts);

// DELETE endpoint to delete a successful product
productRoutes.delete("/deleteSuccessProduct/:id", deleteSuccessProduct);

// DELETE endpoint to delete a product's cloudinary Image by ID
productRoutes.delete("/delete-image", deleteImage);

//-------------------Feedback-------------------//

// POST endpoint to submit feedback
productRoutes.post("/submit", submitFeedback);

//-------------------Payment-------------------//

// PATCH endpoint to update temporary bidding data
productRoutes.patch("/tempdata/:id", patchProduct);

//-------------------Contact-Us-------------------//

// POST endpoint for contact form submissions
productRoutes.post("/contact-us", handleContactSubmission);

module.exports = productRoutes;
