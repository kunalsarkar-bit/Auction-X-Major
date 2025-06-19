const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  category: { type: String, required: true },
  images: [
    {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  biddingStartPrice: { type: Number, required: true },
  highestBid: { type: Number, default: 0 },
  phoneNo:  { type: String, required: true },
  address:  { type: String, required: true },
}, { timestamps: true });

// Export the Order model
// module.exports = mongoose.model('Order', orderSchema);
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
