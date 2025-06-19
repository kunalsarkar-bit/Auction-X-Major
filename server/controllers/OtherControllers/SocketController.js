let productData = {}; // Store product data for each product ID

const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    // Send product data to new clients when they join
    socket.on("joinProductRoom", (productId) => {
      socket.join(productId); // Join a room based on the product ID
      if (productData[productId]) {
        socket.emit("productData", productData[productId]); // Emit data for this product
      } else {
        productData[productId] = { currentBid: 0, bidderName: "", productId }; // Initialize if not present
      }
    });

    // Listen for bid updates from clients
    socket.on("placeBid", (newBidData) => {
      const { productId, currentBid, bidderName } = newBidData;
      if (!productData[productId]) {
        productData[productId] = { currentBid: 0, bidderName: "", productId }; // Ensure product exists
      }

      // Update the specific product data
      productData[productId] = {
        ...productData[productId],
        currentBid,
        bidderName,
      };

      // Emit updated product data to all users in the specific room
      io.to(productId).emit("productData", productData[productId]);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = socketController;
