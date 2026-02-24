const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const cropRequirements = require('../data/cropRequirements');
const yieldData = require('../data/yieldData');

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

        // 2. Calculate Yield Prediction (Heuristic Engine)
        const baseYield = yieldData[crop.toLowerCase()] || 2.0;
        let estimatedYield = baseYield;

        if (requirements) {
            // Factor: How close are we to optimal nutrition?
            const nFactor = Math.min(N / requirements.N, 1.1); // Slight boost for over-fertilizing but diminishing returns
            const pFactor = Math.min(P / requirements.P, 1.1);
            const kFactor = Math.min(K / requirements.K, 1.1);

            const nutrientScore = (nFactor + pFactor + kFactor) / 3;

            // Yield is base modified by nutrition (70% base guaranteed + 30% nutrition weight)
            estimatedYield = baseYield * (0.7 + (0.3 * nutrientScore));
        }

        const newRecord = new Recommendation({
            user: req.user._id,
            inputs: { N, P, K, temperature, humidity, ph, rainfall },
            prediction: {
                crop,
                irrigation,
                yield: estimatedYield.toFixed(2) // Storing yield in the record
            },
            fertilizer: fertilizerAdvice
        });

        await newRecord.save();

        res.json({
            status: 'success',
            crop,
            irrigation,
            yield: estimatedYield.toFixed(2),
            fertilizer: fertilizerAdvice,
            recordId: newRecord._id
        });
    } catch (error) {
        console.error('❌ Error in getRecommendation:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
