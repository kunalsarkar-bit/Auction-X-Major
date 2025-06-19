const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
TransactionSchema.index({ userEmail: 1, date: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);