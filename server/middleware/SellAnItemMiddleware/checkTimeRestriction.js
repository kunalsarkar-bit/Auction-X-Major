const Product = require("../../models/SellAnItemSchema/Product");

const checkTimeRestriction = async (req, res, next) => {
  try {
    const currentTime = new Date();
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const bidEndTime = new Date(product.bidEndTime);
    if (currentTime > bidEndTime) {
      return res
        .status(403)
        .json({ error: "Operation not allowed, bidding time has passed." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkTimeRestriction;
