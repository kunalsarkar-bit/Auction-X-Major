// routes/OrderRoutes.js
const express = require("express");
const OrderRoutes = express.Router();
const orderController = require("../../controllers/SellerControllers/SellerOrderControllers/orderControllers");

// Route to create a new order
OrderRoutes.post("/", orderController.createOrder);

// Route to get all orders
OrderRoutes.get("/", orderController.getAllOrders);

// Route to get a specific order by ID
OrderRoutes.get("/:id", orderController.getOrderById);

// Route to get all orders by email
OrderRoutes.get("/orders", orderController.getOrdersByUserEmail);

// Route to get orders by userEmail
OrderRoutes.get("/user/:email", orderController.getOrdersByUserEmail);

// Route to get orders by sellerEmail
OrderRoutes.get("/seller/:email", orderController.getOrdersBySellerEmail);

module.exports = OrderRoutes;
