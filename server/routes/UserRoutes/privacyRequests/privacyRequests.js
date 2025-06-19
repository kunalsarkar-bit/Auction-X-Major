const express = require("express");
const router = express.Router();
const privacyRequestController = require("../../../controllers/UserControllers/PrivacyRequest/privacyRequestController");


// Route to create a new privacy or support request
router.post("/", privacyRequestController.createPrivacyRequest);

// Route to get all requests (filtered by category if provided)
router.get("/", privacyRequestController.getAllPrivacyRequests);

// Route to get a request by ID
router.get("/:id", privacyRequestController.getPrivacyRequestById);
router.put("/:id", privacyRequestController.updatePrivacyRequestStatus);
module.exports = router;
