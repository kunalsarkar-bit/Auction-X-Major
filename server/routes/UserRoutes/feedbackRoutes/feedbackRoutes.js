// routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();

const feedbackController = require('../../../controllers/UserControllers/feedbackController/feedbackUserController');

// POST - Create new feedback
router.post('/', feedbackController.createFeedbackUser);

// GET - Get all feedbacks
router.get('/', feedbackController.getAllFeedback);

// GET - Get feedback by email
router.get('/email/:email', feedbackController.getFeedbackByEmail);

module.exports = router;
