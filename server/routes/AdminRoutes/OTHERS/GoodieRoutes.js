const express = require("express");
const router = express.Router();
const goodieController = require("../../../controllers/AdminControllers/OthersControllers/GoodieControllers");

router.post("/", goodieController.createGoodie);
router.get("/", goodieController.getAllGoodies);
router.get("/category/:category", goodieController.getGoodiesByCategory);
router.patch("/:id", goodieController.updateGoodie);
router.delete("/:id", goodieController.deleteGoodie);

module.exports = router;
