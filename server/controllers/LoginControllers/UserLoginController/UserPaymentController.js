// controllers/LoginControllers/UserLoginController/UserPaymentController.js

const UserModel = require("../../../models/LoginSchema/user");

// ✅ PATCH: Update user amount (requires protectRoute)
const updateAmount = async (req, res) => {
  const { email, amount } = req.body;

  if (amount === undefined || isNaN(amount)) {
    return res.status(400).json({ error: "Amount is required and must be a number." });
  }

  try {
    let updatedUser;

    if (email) {
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { amount },
        { new: true }
      );
    } else if (req.user && req.user._id) {
      updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { amount },
        { new: true }
      );
    } else {
      return res.status(400).json({ error: "Email or user ID is required." });
    }

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Amount updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating amount:", error);
    res.status(500).json({ error: "Failed to update amount." });
  }
};


// ✅ GET: Get user amount (requires protectRoute)
const getAmount = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ amount: user.amount, name: user.name });
  } catch (error) {
    console.error("Error fetching amount:", error);
    res.status(500).json({ error: "Failed to fetch amount." });
  }
};
const getAmountbyEmail = async (req, res) => {
   try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ amount: user.amount, name: user.name });
  } catch (error) {
    console.error("Error fetching amount:", error);
    res.status(500).json({ error: "Failed to fetch amount." });
  }
};

module.exports = {
  updateAmount,
  getAmount,
  getAmountbyEmail
};
