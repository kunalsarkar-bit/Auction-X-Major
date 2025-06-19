const Deposit = require("../../../../models/AdminModels/FINANCE/Deposit");
const User = require("../../../../models/LoginSchema/user");

// Get all deposits with pagination
exports.getAllDeposits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const deposits = await Deposit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDeposits = await Deposit.countDocuments();
    const totalPages = Math.ceil(totalDeposits / limit);

    res.json({
      deposits,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching deposits:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve a deposit
exports.approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Update user balance
    await User.findByIdAndUpdate(deposit.user, {
      $inc: { balance: deposit.amount },
    });

    res.json(deposit);
  } catch (err) {
    console.error("Error approving deposit:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a deposit
exports.rejectDeposit = async (req, res) => {
  try {
    const { notes } = req.body;
    const deposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
        notes: notes || "Deposit rejected by admin",
      },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    res.json(deposit);
  } catch (err) {
    console.error("Error rejecting deposit:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single deposit
exports.getDepositById = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    res.json(deposit);
  } catch (err) {
    console.error("Error fetching deposit:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new deposit (for user submissions)
exports.createDeposit = async (req, res) => {
  try {
    const { userId, amount, paymentMethod, receiptImage } = req.body;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate transaction ID
    const transactionId = `DEP${Date.now().toString().slice(-8)}${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0")}`;

    const deposit = new Deposit({
      user: userId,
      userEmail: user.email,
      userName: user.name || `User${userId.toString().slice(-4)}`,
      userAvatar: user.avatar || "",
      amount,
      transactionId,
      paymentMethod,
      receiptImage,
      status: "Pending",
    });

    await deposit.save();

    res.status(201).json(deposit);
  } catch (err) {
    console.error("Error creating deposit:", err);
    res.status(500).json({ message: "Server error" });
  }
};
