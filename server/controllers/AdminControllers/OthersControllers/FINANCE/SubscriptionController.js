const Subscription = require("../../../../models/AdminModels/FINANCE/Subscription");
const { validationResult } = require("express-validator");

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
exports.getSubscriptions = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    // Filtering
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.userEmail) {
      filter.userEmail = new RegExp(req.query.userEmail, "i");
    }

    const subscriptions = await Subscription.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Subscription.countDocuments(filter);

    res.json({
      success: true,
      count: subscriptions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      subscriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private/Admin or Subscription Owner
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).lean();

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    // Check if user is admin or subscription owner
    if (
      req.user.role !== "admin" &&
      subscription.userId.toString() !== req.user.id
    ) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private/Admin
exports.createSubscription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      planName,
      userEmail,
      status,
      startDate,
      endDate,
      price,
      autoRenew,
      features,
      userId,
    } = req.body;

    const subscription = new Subscription({
      planName,
      userEmail,
      status,
      startDate: startDate || Date.now(),
      endDate,
      price,
      autoRenew: autoRenew || false,
      features: features || [],
      userId,
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      subscription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private/Admin or Subscription Owner
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    // Check if user is admin or subscription owner
    if (
      req.user.role !== "admin" &&
      subscription.userId.toString() !== req.user.id
    ) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "autoRenew", "endDate", "features"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ success: false, error: "Invalid updates" });
    }

    updates.forEach((update) => (subscription[update] = req.body[update]));
    await subscription.save();

    res.json({
      success: true,
      subscription,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private/Admin or Subscription Owner
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    // Check if user is admin or subscription owner
    if (
      req.user.role !== "admin" &&
      subscription.userId.toString() !== req.user.id
    ) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    if (subscription.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, error: "Subscription already cancelled" });
    }

    subscription.status = "cancelled";
    subscription.autoRenew = false;
    await subscription.save();

    res.json({
      success: true,
      subscription,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private/Admin
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    await subscription.remove();

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
