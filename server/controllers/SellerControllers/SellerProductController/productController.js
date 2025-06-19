const Product = require("../../../models/SellAnItemSchema/Product");
const {
  cloudinary,
  deleteFromCloudinary,
} = require("../../../middleware/Media/cloudinaryMiddleware");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      mobileNumber,
      biddingStartDate,
      biddingStartTime,
      biddingStartPrice,
      email,
      hasBanner,
      bannerPlan,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      !mobileNumber ||
      !biddingStartDate ||
      !biddingStartTime ||
      !biddingStartPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate that at least one product image is uploaded
    if (!req.productImages || req.productImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Convert bidding start time to UTC
    const startDateTimeLocal = new Date(
      `${biddingStartDate}T${biddingStartTime}:00`
    ); // Local time
    const startDateTimeUTC = new Date(startDateTimeLocal.toISOString()); // Convert to UTC

    // Calculate bidding end time (24 hours from start) in UTC
    const endDateTimeUTC = new Date(startDateTimeUTC.getTime() + 2 * 60 * 1000);

    // Parse the description points and convert to JSON
    const descriptionPoints = JSON.parse(description);

    // Create product object
    const productData = {
      name,
      category,
      description: descriptionPoints,
      mobileNumber,
      biddingStartDate: startDateTimeUTC.toISOString(), // Store in ISO format (UTC)
      biddingStartTime: startDateTimeUTC.toISOString(), // Store in ISO format (UTC)
      biddingStartPrice: Number(biddingStartPrice),
      email,
      images: req.productImages,
      biddingEndTime: endDateTimeUTC.toISOString(), // Store end time in UTC (ISO 8601)
      hasBanner: hasBanner === "true",
    };

    // If banner is selected, add banner info
    if (hasBanner === "true" && req.bannerImage) {
      productData.bannerImage = req.bannerImage;
      productData.bannerPlan = bannerPlan;
    }

    // Save the product to the database
    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

// Get products by email
exports.getProductsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const products = await Product.find({ email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find products by category
    const products = await Product.find({
      category: category,
      status: "Active", // Only fetch active products
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: `No products found in category: ${category}`,
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If there are new images uploaded, add them to the product
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        secure_url: file.path,
        public_id: file.filename,
      }));

      updateData.images = [...product.images, ...newImages];
    }

    // If there's a new banner image
    if (updateData.hasBanner === "true" && req.file) {
      // Delete old banner image if exists
      if (product.bannerImage && product.bannerImage.public_id) {
        await deleteFromCloudinary(product.bannerImage.public_id);
      }

      updateData.bannerImage = {
        secure_url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // Parse description if it's provided as a string
    if (updateData.description && typeof updateData.description === "string") {
      updateData.description = JSON.parse(updateData.description);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// Update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Active", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product status",
    });
  }
};

// Patch product for temporary data
exports.patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { tempuseremail, tempamount, tempname } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { tempuseremail, tempamount, tempname },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Temporary data updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update temporary data",
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all associated images from Cloudinary
    const deletePromises = [];

    // Delete product images
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        if (image.public_id) {
          deletePromises.push(deleteFromCloudinary(image.public_id));
        }
      });
    }

    // Delete banner image if exists
    if (
      product.hasBanner &&
      product.bannerImage &&
      product.bannerImage.public_id
    ) {
      deletePromises.push(deleteFromCloudinary(product.bannerImage.public_id));
    }

    await Promise.all(deletePromises);

    // Delete product from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

// Delete multiple products by IDs
exports.deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of product IDs

    if (!ids || !Array.isArray(ids)) {
      // Fixed: Added missing closing parenthesis
      return res.status(400).json({
        success: false,
        message: "Invalid request. Please provide an array of product IDs",
      });
    }

    // Find all products to be deleted
    const products = await Product.find({ _id: { $in: ids } });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with the provided IDs",
      });
    }

    // Delete all associated images from Cloudinary
    const deletePromises = [];

    products.forEach((product) => {
      // Delete product images
      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          if (image.public_id) {
            deletePromises.push(deleteFromCloudinary(image.public_id));
          }
        });
      }

      // Delete banner image if exists
      if (
        product.hasBanner &&
        product.bannerImage &&
        product.bannerImage.public_id
      ) {
        deletePromises.push(
          deleteFromCloudinary(product.bannerImage.public_id)
        );
      }
    });

    // Wait for all Cloudinary deletions to complete
    await Promise.all(deletePromises);

    // Delete all products from database
    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} products deleted successfully`,
      deletedCount: ids.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete products",
    });
  }
};

// Delete successful product (after auction ends)
exports.deleteSuccessProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

// Delete specific image
exports.deleteImage = async (req, res) => {
  try {
    const { productId, imageId, public_id } = req.body;

    if (!productId || !imageId || !public_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID, image ID, and public_id are required",
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(public_id);

    // Remove image from product document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $pull: { images: { _id: imageId } } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image",
    });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    // Implement feedback submission logic
    // This can be connected to a separate feedback model if needed
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // Here you would typically save to a Feedback model
    // For now, we'll just return success

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit feedback",
    });
  }
};
