const Recommendation = require('../models/Recommendation');

exports.getHistory = async (req, res) => {
    try {
        const history = await Recommendation.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
