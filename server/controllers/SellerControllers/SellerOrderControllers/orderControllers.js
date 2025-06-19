// controllers/orderController.js
const Order = require("../../../models/SellAnItemSchema/orderSchema");

// CREATE: Add a new order
exports.createOrder = async (req, res) => {
  const {
    title,
    name,
    userEmail,
    sellerEmail,
    category,
    images,
    biddingStartPrice,
    highestBid,
    phoneNo,
    address,
  } = req.body;

  // Check required fields
  if (
    !title ||
    !name ||
    !userEmail ||
    !sellerEmail ||
    !category ||
    !images ||
    !biddingStartPrice ||
    !phoneNo ||
    !address
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  try {
    const newOrder = new Order({
      title,
      name,
      userEmail,
      sellerEmail,
      category,
      images,
      biddingStartPrice,
      highestBid,
      phoneNo,
      address,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order", details: error.message });
  }
};

// READ: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// READ: Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

exports.getOrdersByUserEmail = async (req, res) => {
  try {
    const { userEmail } = req.query;

    // Validate email is provided
    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    // Find orders for the specific user email
    const orders = await Order.find({ userEmail });

    // If no orders found, return empty array
    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    // Return found orders
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

// Get all orders by userEmail
exports.getOrdersByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// Get all orders by sellerEmail
exports.getOrdersBySellerEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ sellerEmail: email });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};
