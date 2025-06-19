const express = require("express");
const router = express.Router();
const reportController = require("../../../controllers/AdminControllers/OthersControllers/ManageUserReportController");
const handleImageUploads = require("../../../middleware/Media/ImageUpload"); // Adjust path as needed

// Get all reports
router.get("/reports", reportController.getAllReports);

// Get a single report by ID
router.get("/reports/:id", reportController.getReportById);

// Create a new report with image upload
router.post("/reports", 
  handleImageUploads([
    { 
      name: 'attachments', 
      folder: 'reports', 
      transformation: { 
        width: 1000, 
        height: 1000, 
        crop: 'limit',
        quality: 'auto'
      } 
    }
  ]), 
  reportController.createReport
);

// Update a report
router.put("/reports/:id", reportController.updateReport);

// Delete a report
router.delete("/reports/:id", reportController.deleteReport);

module.exports = router;