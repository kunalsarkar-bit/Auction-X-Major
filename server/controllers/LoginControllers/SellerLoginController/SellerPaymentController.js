const SellerModel = require("../../../models/LoginSchema/seller");

const updateAmount = async (req, res) => {
  const { email, amount } = req.body;
  console.log(email, amount);

  if (!email || !amount) {
    return res.status(400).json({ error: "Email and amount are required." });
  }

  try {
    // Find user by email and update the amount
    const updatedPayment = await SellerModel.findOneAndUpdate(
      { email }, // Find by email
      { amount }, // Update the amount
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "User not found." });
    }

    // Respond with success
    res
      .status(200)
      .json({ message: "Amount updated successfully!", data: updatedPayment });
  } catch (error) {
    console.error("Error updating amount in the database:", error);
    res.status(500).json({ error: "Failed to update amount." });
  }
};

const getAmount = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const user = await SellerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Respond with the user's amount
    res.status(200).json({ amount: user.amount, name: user.name });
  } catch (error) {
    console.error("Error fetching amount:", error);
    res.status(500).json({ error: "Failed to fetch amount." });
  }
};

module.exports = {
  updateAmount,
  getAmount,
};
