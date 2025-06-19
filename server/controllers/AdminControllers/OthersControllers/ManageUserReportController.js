const Report = require("../../../models/AdminModels/OTHERS/Reports");

// Helper function to validate and clean input
const validateAndCleanInput = (data) => {
  const cleaned = {};

  // Required fields
  const requiredFields = ["name", "email", "reportType", "details"];

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || typeof value !== "string" || value.trim() === "") {
      throw new Error(`${field} is required and cannot be empty`);
    }

    // Map frontend field names to backend field names
    switch (field) {
      case "name":
        cleaned.userName = value.trim();
        break;
      case "email":
        cleaned.userEmail = value.trim();
        break;
      case "details":
        cleaned.report = value.trim();
        break;
      default:
        cleaned[field] = value.trim();
    }
  }

  // Optional field - orderNumber
  if (
    data.orderNumber &&
    typeof data.orderNumber === "string" &&
    data.orderNumber.trim() !== ""
  ) {
    cleaned.orderId = data.orderNumber.trim();
  }

  return cleaned;
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 }); // Sort by newest first
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  try {
    // Validate and clean input data
    const cleanedData = validateAndCleanInput(req.body);

    // Handle attachments from Cloudinary upload
    if (req.cloudinaryUploads && req.cloudinaryUploads.attachments) {
      cleanedData.attachments = req.cloudinaryUploads.attachments;
    } else {
      cleanedData.attachments = []; // Empty array if no attachments
    }

    // Create new report
    const newReport = new Report(cleanedData);
    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a report
exports.updateReport = async (req, res) => {
  try {
    // Find the report first
    const existingReport = await Report.findById(req.params.id);
    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Clean the update data (remove empty strings)
    const updateData = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== null && value !== undefined && value !== "") {
        if (typeof value === "string") {
          updateData[key] = value.trim();
        } else {
          updateData[key] = value;
        }
      }
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true, // Run schema validators on update
      }
    );

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a report
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // TODO: Delete associated images from Cloudinary if needed
    // if (deletedReport.attachments && deletedReport.attachments.length > 0) {
    //   for (const attachment of deletedReport.attachments) {
    //     await cloudinary.uploader.destroy(attachment.public_id);
    //   }
    // }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
