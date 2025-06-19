const Banner = require("../../../../models/AdminModels/TASKS/Banner");
const {
  deleteFromCloudinary,
} = require("../../../../utlis/Image/cloudinaryConfig"); // Assuming you use Cloudinary for image uploads

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: banners,
    });
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching banners",
    });
  }
};

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, description, link, position, startDate, endDate, isActive } =
      req.body;

    // Check if image was uploaded
    if (!req.cloudinaryUploads || !req.cloudinaryUploads.image) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const imageUrl = req.cloudinaryUploads.image[0].secure_url;
    const imagePublicId = req.cloudinaryUploads.image[0].public_id;

    const banner = new Banner({
      title,
      description,
      link,
      position,
      imageUrl,
      imagePublicId, // Store public_id for future deletion
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive === "true" || isActive === true,
    });

    await banner.save();

    res.status(201).json({
      success: true,
      data: banner,
      message: "Banner created successfully",
    });
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating banner",
    });
  }
};

// Update banner status
exports.updateBannerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      data: banner,
      message: "Banner status updated successfully",
    });
  } catch (err) {
    console.error("Error updating banner status:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating banner status",
    });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Delete image from Cloudinary
    if (banner.imagePublicId) {
      await deleteFromCloudinary(banner.imagePublicId);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting banner",
    });
  }
};
