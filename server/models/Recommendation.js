const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputs: {
        N: Number,
        P: Number,
        K: Number,
        temperature: Number,
        humidity: Number,
        ph: Number,
        rainfall: Number
    },
    prediction: {
        crop: String,
        irrigation: String,
        yield: String,
        marketPrice: Number,
        estimatedRevenue: Number,
        marketTrend: String
    },
    fertilizer: {
        N: String,
        P: String,
        K: String,
        summary: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
