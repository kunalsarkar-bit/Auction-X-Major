const express = require("express");
const router = express.Router();
const calendarController = require("../../../controllers/AdminControllers/ManageSellersControllers/TASKS/CalendarController");

// Create a new calendar entry
router.post("/", calendarController.createCalendarEntry);

// Get all calendar entries
router.get("/", calendarController.getAllCalendarEntries);

// Get calendar entries for a specific date
router.get("/date/:date", async (req, res) => {
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

module.exports = router;
