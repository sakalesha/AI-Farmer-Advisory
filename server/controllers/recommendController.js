const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const cropRequirements = require('../data/cropRequirements');
const marketPrices = require('../data/marketPrices');
const { LRUCache } = require('lru-cache');

const mlCache = new LRUCache({
    max: 200,
    ttl: 1000 * 60 * 60 * 24 // 24 hours
});

exports.getRecommendation = async (req, res) => {
    try {
        const { fieldName, N, P, K, temperature, humidity, ph, rainfall } = req.body;
        const ML_SERVICE_PORT = process.env.ML_SERVICE_PORT || 5001;
        const cacheKey = `${N}|${P}|${K}|${temperature}|${humidity}|${ph}|${rainfall}`;
        
        let crop, irrigation;
        let estimatedYield = 2.0;
        let yieldInterval = null;

        const cachedData = mlCache.get(cacheKey);

        if (cachedData) {
            crop = cachedData.crop;
            irrigation = cachedData.irrigation;
            estimatedYield = cachedData.estimatedYield;
            yieldInterval = cachedData.yieldInterval;
        } else {
            // Internal call to Python service running on port 5001
            const ML_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict`;

            const mlResponse = await axios.post(ML_URL, {
                N, P, K, temperature, humidity, ph, rainfall
            });

            crop = mlResponse.data.crop;
            irrigation = mlResponse.data.irrigation;

            // Fetch ML Yield Prediction
            const YIELD_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict_yield`;
            try {
                const yieldResponse = await axios.post(YIELD_URL, {
                    crop, N, P, K, temperature, humidity, ph, rainfall
                });
                if (yieldResponse.data && yieldResponse.data.yield) {
                    estimatedYield = yieldResponse.data.yield;
                    yieldInterval = yieldResponse.data.interval || null;
                }
            } catch (yieldError) {
                console.error('⚠️ Yield Prediction Error (falling back to default):', yieldError.message);
            }

            // Save to cache
            mlCache.set(cacheKey, { crop, irrigation, estimatedYield, yieldInterval });
        }

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

        // 3. Market Analysis & LSTM Profitability Forecast
        const PRICE_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict_price_trend`;
        let pricePerTon = marketPrices[crop.toLowerCase()] || 500;
        let predictedPrice = pricePerTon;
        let marketTrend = "Stable";
        let usdToInr = 83.5;

        try {
            const res = await axios.get('https://api.frankfurter.app/latest?from=USD&to=INR', { timeout: 4000 });
            if (res.data?.rates?.INR) usdToInr = res.data.rates.INR;
        } catch (ex) {
            console.warn('⚠️ Exchange rate fetch failed, using fallback:', usdToInr);
        }

        try {
            const priceResponse = await axios.post(PRICE_URL, { crop });
            if (priceResponse.data && priceResponse.data.status === 'success') {
                pricePerTon = priceResponse.data.current_price;
                predictedPrice = priceResponse.data.predicted_price;
                marketTrend = priceResponse.data.trend;
            }
        } catch (priceError) {
            console.error('⚠️ Price Prediction Error (falling back to static):', priceError.message);
            // Fallback trend simulation
            const trendValue = (Math.random() * 20) - 5;
            marketTrend = trendValue > 2 ? 'Up' : trendValue < -2 ? 'Down' : 'Stable';
        }

        // Apply currency conversion (USD to INR)
        pricePerTon = Math.round(pricePerTon * usdToInr);
        predictedPrice = Math.round(predictedPrice * usdToInr);
        const estimatedRevenue = estimatedYield * predictedPrice;

        const newRecord = new Recommendation({
            fieldName: fieldName || 'Unnamed Field',
            user: req.user._id,
            inputs: { N, P, K, temperature, humidity, ph, rainfall },
            prediction: {
                crop,
                irrigation,
                yield: estimatedYield.toFixed(2), // Storing yield in the record
                yieldInterval,
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
            yieldInterval,
            market: {
                pricePerTon,
                predictedPrice,
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
