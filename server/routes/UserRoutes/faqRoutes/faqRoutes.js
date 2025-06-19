const express = require('express');
const faqController = require('../../../controllers/UserControllers/faqController/faqController');

const router = express.Router();

// Define routes
router.get('/search-faq', faqController.search);

// You can add more routes here as your application grows
// For example:
// router.post('/faq', faqController.create);
// router.get('/faq/:id', faqController.getById);
// router.put('/faq/:id', faqController.update);
// router.delete('/faq/:id', faqController.delete);

module.exports = router;