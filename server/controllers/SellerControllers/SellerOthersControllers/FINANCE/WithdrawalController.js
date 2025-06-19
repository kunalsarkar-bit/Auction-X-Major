const Withdrawal = require("../../../../models/AdminModels/FINANCE/Withdrawal");
const User = require("../../../../models/LoginSchema/user");

// Get all withdrawals with pagination and filtering
exports.getAllWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalWithdrawals = await Withdrawal.countDocuments(query);
    const totalPages = Math.ceil(totalWithdrawals / limit);

    res.json({
      withdrawals,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching withdrawals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update withdrawal status
exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["pending", "processing", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    // If status is completed, you might want to update user balance here
    if (status === "completed") {
      // Optional: Add logic to actually process the withdrawal
    }

    res.json(withdrawal);
  } catch (err) {
    console.error("Error updating withdrawal status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new withdrawal request
exports.createWithdrawal = async (req, res) => {
  try {
    const { userId, amount, method, accountNumber, notes } = req.body;

    // Check user balance (you'll need to implement this based on your User model)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (user.balance < amount) {
    //   return res.status(400).json({ message: 'Insufficient balance' });
    // }

    const withdrawal = new Withdrawal({
      user: userId,
      userEmail: user.email,
      amount,
      method,
      accountNumber,
      notes,
      status: "pending",
    });

    await withdrawal.save();

    // Optionally deduct from user's balance immediately or when completed
    // user.balance -= amount;
    // await user.save();

    res.status(201).json(withdrawal);
  } catch (err) {
    console.error("Error creating withdrawal:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get withdrawal by ID
exports.getWithdrawalById = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    res.json(withdrawal);
  } catch (err) {
    console.error("Error fetching withdrawal:", err);
    res.status(500).json({ message: "Server error" });
  }
};
