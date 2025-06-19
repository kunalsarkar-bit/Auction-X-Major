const Goodie = require("../../../models/AdminModels/OTHERS/Goodie");

// Create Goodie
exports.createGoodie = async (req, res) => {
  try {
    const goodie = await Goodie.create(req.body);
    res.status(201).json(goodie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Goodies
exports.getAllGoodies = async (req, res) => {
  try {
    const goodies = await Goodie.find().sort({ createdAt: -1 });
    res.json(goodies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Goodies by Category
exports.getGoodiesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const goodies = await Goodie.find({ category }).sort({ createdAt: -1 });
    res.json(goodies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Goodie
exports.updateGoodie = async (req, res) => {
  try {
    const updated = await Goodie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Goodie
exports.deleteGoodie = async (req, res) => {
  try {
    await Goodie.findByIdAndDelete(req.params.id);
    res.json({ message: "Goodie deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
