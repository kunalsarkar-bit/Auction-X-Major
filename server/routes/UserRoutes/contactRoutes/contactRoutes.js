const express = require("express");
const { submitContact, getAllContacts ,getContactById } = require("../../../controllers/UserControllers/contactController/contactController");

const router = express.Router();

router.post("/", submitContact);
router.get("/", getAllContacts);
router.get("/:id", getContactById);

module.exports = router;
