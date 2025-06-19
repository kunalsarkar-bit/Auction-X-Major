// controllers/feedbackController.js

const FeedbackUser = require('../../../models/UserModels/Feedback/feedbackUserSchema');

// POST - Create new feedback user
exports.createFeedbackUser = async (req, res) => {
    try {
        const { email, name, phone, checkbox_values } = req.body;

        const newFeedbackUser = new FeedbackUser({
            email,
            name,
            phone,
            checkbox_values
        });

        const savedFeedbackUser = await newFeedbackUser.save();
        res.status(201).json(savedFeedbackUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET - Get all feedbacks
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await FeedbackUser.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET - Get feedbacks by email
exports.getFeedbackByEmail = async (req, res) => {
    try {
        const email = req.params.email;

        const feedbacks = await FeedbackUser.find({ email });

        if (!feedbacks.length) {
            return res.status(404).json({ message: 'No feedback found for this email' });
        }

        res.status(200).json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
