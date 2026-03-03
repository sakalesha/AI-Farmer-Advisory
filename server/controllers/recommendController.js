const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const cropRequirements = require('../data/cropRequirements');
const marketPrices = require('../data/marketPrices');

exports.getRecommendation = async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

        // Internal call to Python service running on port 5001
        const ML_SERVICE_PORT = process.env.ML_SERVICE_PORT || 5001;
        const ML_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict`;

        const mlResponse = await axios.post(ML_URL, {
            N, P, K, temperature, humidity, ph, rainfall
        });

        const { crop, irrigation } = mlResponse.data;

        // 1. Calculate Fertilizer Advice
        const requirements = cropRequirements[crop.toLowerCase()];
        let fertilizerAdvice = {};

        if (requirements) {
            const nDeficit = requirements.N - N;
            const pDeficit = requirements.P - P;
            const kDeficit = requirements.K - K;

            fertilizerAdvice = {
                N: nDeficit > 0 ? `Add ${nDeficit} units of Nitrogen` : 'Optimal',
                P: pDeficit > 0 ? `Add ${pDeficit} units of Phosphorus` : 'Optimal',
                K: kDeficit > 0 ? `Add ${kDeficit} units of Potassium` : 'Optimal',
                summary: []
            };

            if (nDeficit > 0) fertilizerAdvice.summary.push(`Nitrogen deficiency detected for ${crop}.`);
            if (pDeficit > 0) fertilizerAdvice.summary.push(`Phosphorus deficiency detected for ${crop}.`);
            if (kDeficit > 0) fertilizerAdvice.summary.push(`Potassium deficiency detected for ${crop}.`);
            if (fertilizerAdvice.summary.length === 0) fertilizerAdvice.summary.push(`Soil nutrient levels are optimal for ${crop}.`);
        } else {
            fertilizerAdvice = { summary: ["General NPK balanced fertilizer recommended."] };
        }

        // 2. Fetch ML Yield Prediction
        const YIELD_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict_yield`;
        let estimatedYield = 2.0; // fallback default

        try {
            const yieldResponse = await axios.post(YIELD_URL, {
                crop, N, P, K, temperature, humidity, ph, rainfall
            });
            if (yieldResponse.data && yieldResponse.data.yield) {
                estimatedYield = yieldResponse.data.yield;
            }
        } catch (yieldError) {
            console.error('⚠️ Yield Prediction Error (falling back to default):', yieldError.message);
        }

        // 3. Market Analysis & Profitability
        const pricePerTon = marketPrices[crop.toLowerCase()] || 500;
        const estimatedRevenue = estimatedYield * pricePerTon;

        // Simulate a market trend (-5% to +15% volatility)
        const trendValue = (Math.random() * 20) - 5;
        const marketTrend = trendValue > 2 ? 'Up' : trendValue < -2 ? 'Down' : 'Stable';

        const newRecord = new Recommendation({
            user: req.user._id,
            inputs: { N, P, K, temperature, humidity, ph, rainfall },
            prediction: {
                crop,
                irrigation,
                yield: estimatedYield.toFixed(2), // Storing yield in the record
                marketPrice: pricePerTon,
                estimatedRevenue: Math.round(estimatedRevenue),
                marketTrend
            },
            fertilizer: fertilizerAdvice
        });

        await newRecord.save();

        res.json({
            status: 'success',
            crop,
            irrigation,
            yield: estimatedYield.toFixed(2),
            market: {
                pricePerTon,
                estimatedRevenue: Math.round(estimatedRevenue),
                trend: marketTrend
            },
            fertilizer: fertilizerAdvice,
            recordId: newRecord._id
        });
    } catch (error) {
        console.error('❌ Error in getRecommendation:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
