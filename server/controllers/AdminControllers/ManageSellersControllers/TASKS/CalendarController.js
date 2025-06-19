const Calendar = require("../../../../models/AdminModels/TASKS/Calendar");

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

exports.createCalendarEntry = async (req, res) => {
  try {
    const { title, date, startTime, endTime, description, type, location } =
      req.body;

    // Validate required fields
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Title, date, startTime, and endTime are required fields",
      });
    }

    // Validate date format
    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create new calendar entry
    const newEntry = new Calendar({
      title,
      date: new Date(date),
      startTime,
      endTime,
      description,
      type: type || "auction", // Default to 'auction' if not provided
      location,
    });

    // Validate the entire entry
    await newEntry.validate();

    // Save to database
    const savedEntry = await newEntry.save();

    return res.status(201).json({
      success: true,
      data: savedEntry,
    });
  } catch (err) {
    console.error("Error creating calendar entry:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error creating calendar entry",
    });
  }
};

exports.getAllCalendarEntries = async (req, res) => {
  try {
    const entries = await Calendar.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error("Error fetching calendar entries:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching calendar entries",
    });
  }
};
