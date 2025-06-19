const express = require("express");
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByType,
} = require("../../../controllers/AdminControllers/OthersControllers/FINANCE/TransactionController");

const router = express.Router();


router.route("/").get(getTransactions).post(createTransaction);
router.get("/type/:type", getTransactionsByType);
router.route("/:id").get(getTransaction);

module.exports = router;
