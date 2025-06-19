const mongoose = require("mongoose");
const Seller = require("../../../../models/AdminModels/SELLER/Seller");
const Transaction = require("../../../../models/AdminModels/FINANCE/Transaction"); // Assuming you have a Transaction model

// Helper to process status counts
const processStatusCounts = (counts) => {
  const result = {
    all: 0,
    active: 0,
    pending_approval: 0,
    suspended: 0,
  };

  counts.forEach((item) => {
    if (item._id) {
      result[item._id] = item.count;
      result.all += item.count;
    }
  });

  return result;
};

// Get all sellers with pagination and filters
exports.getAllSellers = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, search } = req.query;

    // Build query
    const query = {};

    // STATUS FILTER (MUST match frontend values)
    if (status && status !== "all") {
      query.status = status; // Ensure this matches "active", "pending_approval", "suspended"
    }

    // SEARCH FILTER
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } }, // Must match model field
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch sellers
    const sellers = await Seller.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalSellers = await Seller.countDocuments(query);
    const totalPages = Math.ceil(totalSellers / limit);

    // Get status counts (for filter badges)
    const statusCounts = await Seller.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      sellers,
      totalPages,
      statusCounts: {
        all: totalSellers,
        active: statusCounts.find((s) => s._id === "active")?.count || 0,
        pending_approval:
          statusCounts.find((s) => s._id === "pending_approval")?.count || 0,
        suspended: statusCounts.find((s) => s._id === "suspended")?.count || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get seller details with recent orders and stats
exports.getSeller = async (req, res) => {
  try {
    // Add this validation FIRST
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    // Convert to ObjectId explicitly
    const sellerId = new mongoose.Types.ObjectId(req.params.id);

    const seller = await Seller.findById(sellerId).lean(); // Add .lean()

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Simplify the response for testing
    res.json({
      success: true,
      seller: {
        ...seller,
        recentOrders: [],
        salesStats: {},
      },
    });
  } catch (err) {
    console.error("RAW ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message, // Include actual error message
    });
  }
};

// Update seller status
exports.updateStatus = async (req, res) => {
  try {
    const validStatuses = ["active", "pending_approval", "suspended"];
    if (!validStatuses.includes(req.body.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    res.json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify seller
exports.verifySeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        status: "active", // Automatically set to active when verified
      },
      { new: true }
    );

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    res.json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get seller statistics
exports.getSellerStats = async (req, res) => {
  try {
    const statusCounts = await Seller.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      statusCounts: processStatusCounts(statusCounts),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get seller stats",
      error: err.message,
    });
  }
};

// Get seller transaction history with pagination
exports.getSellerHistory = async (req, res) => {
  try {
    // Enhanced authentication check
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No valid session found.",
        code: "AUTH_REQUIRED",
      });
    }

    // Validate query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
        code: "INVALID_PAGINATION",
        details: {
          expected: {
            page: "Positive integer",
            limit: "Positive integer",
          },
          received: {
            page: req.query.page,
            limit: req.query.limit,
          },
        },
      });
    }

    const skip = (page - 1) * limit;
    const sellerEmail = req.user.email;

    // Query with error handling for database issues
    const transactions = await Transaction.find({ userEmail: sellerEmail })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .catch((err) => {
        throw new Error(`Database query failed: ${err.message}`);
      });

    // Transform transactions
    const transformedTransactions = transactions.map((transaction) => ({
      _id: transaction._id,
      itemName: transaction.notes || "Transaction",
      image: transaction.image || "/images/transaction-icon.png",
      sellerEmail,
      buyerEmail: transaction.buyerEmail || "buyer@example.com",
      saleDate: transaction.date,
      amount: transaction.amount,
      status: capitalizeFirstLetter(transaction.status),
      commission: calculateCommission(transaction.amount),
      notes: transaction.notes,
    }));

    // Get total count
    const totalTransactions = await Transaction.countDocuments({
      userEmail: sellerEmail,
    });
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      success: true,
      data: {
        transactions: transformedTransactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "SERVER_ERROR",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// Helper functions remain the same
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function calculateCommission(amount) {
  return amount * 0.1;
}

// Get single transaction details with enhanced security
exports.getTransactionDetails = async (req, res) => {
  try {
    // Validate authentication
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "UNAUTHENTICATED",
      });
    }

    // Validate transaction ID
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
        code: "INVALID_ID",
      });
    }

    const transaction = await Transaction.findById(req.params.id).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        code: "NOT_FOUND",
      });
    }

    // Verify ownership
    if (transaction.userEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to transaction",
        code: "FORBIDDEN",
      });
    }

    // Transform transaction
    const transformedTransaction = {
      _id: transaction._id,
      itemName: transaction.notes || "Transaction",
      image: transaction.image || "/images/transaction-icon.png",
      sellerEmail: transaction.userEmail,
      buyerEmail: transaction.buyerEmail || "buyer@example.com",
      saleDate: transaction.date,
      amount: transaction.amount,
      status: capitalizeFirstLetter(transaction.status),
      commission: calculateCommission(transaction.amount),
      notes: transaction.notes,
      // Include additional fields if needed
      paymentMethod: transaction.paymentMethod,
      transactionFee: transaction.transactionFee,
    };

    res.status(200).json({
      success: true,
      transaction: transformedTransaction,
    });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "SERVER_ERROR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (typeof string !== "string" || string.length === 0) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Improved commission calculation
function calculateCommission(amount) {
  if (typeof amount !== "number" || amount < 0) return 0;

  const baseRate = 0.1; // 10%
  const minCommission = 1.0; // Minimum $1 commission
  const calculated = amount * baseRate;

  return Math.max(calculated, minCommission).toFixed(2);
}
