const axios = require('axios');

exports.getAllMarketPrices = async (req, res) => {
    try {
        // Internal call to Python ML Service
        const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';
        const ML_URL = `${ML_BASE_URL}/api/prices/all`;

        const mlResponse = await axios.get(ML_URL);

        if (mlResponse.data && mlResponse.data.status === 'success') {
            res.status(200).json({
                status: 'success',
                data: mlResponse.data.data
            });
        } else {
            throw new Error("Invalid response from ML service");
        }
    } catch (error) {
        console.error('❌ Error fetching all market prices:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch market prices' });
    }
};
