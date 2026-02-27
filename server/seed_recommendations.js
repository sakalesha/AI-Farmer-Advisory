const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Recommendation = require('./models/Recommendation');
const cropRequirements = require('./data/cropRequirements');
const yieldData = require('./data/yieldData');
const marketPrices = require('./data/marketPrices');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'ronadasakalesha@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        console.log(`Found user: ${user.fullName} (${user._id})`);

        // Clear existing recommendations for this user to avoid duplicates if re-run
        // const deleteResult = await Recommendation.deleteMany({ user: user._id });
        // console.log(`Deleted ${deleteResult.deletedCount} existing recommendations.`);

        const cropsToSeed = [
            'rice', 'maize', 'coffee', 'banana', 'grapes',
            'pomegranate', 'apple', 'orange', 'cotton', 'jute'
        ];

        const recommendations = cropsToSeed.map((cropName, index) => {
            const crop = cropName.toLowerCase();
            const reqs = cropRequirements[crop] || { N: 50, P: 50, K: 50 };

            // Generate some random input values around the requirements
            const N = reqs.N + (Math.random() * 20 - 10);
            const P = reqs.P + (Math.random() * 20 - 10);
            const K = reqs.K + (Math.random() * 20 - 10);
            const temperature = 20 + Math.random() * 15;
            const humidity = 50 + Math.random() * 40;
            const ph = 5.5 + Math.random() * 2;
            const rainfall = 100 + Math.random() * 200;

            const baseYield = yieldData[crop] || 2.0;
            const pricePerTon = marketPrices[crop] || 500;

            const nFactor = Math.min(N / reqs.N, 1.1);
            const pFactor = Math.min(P / reqs.P, 1.1);
            const kFactor = Math.min(K / reqs.K, 1.1);
            const nutrientScore = (nFactor + pFactor + kFactor) / 3;
            const estimatedYield = baseYield * (0.7 + (0.3 * nutrientScore));
            const estimatedRevenue = estimatedYield * pricePerTon;

            const nDeficit = reqs.N - N;
            const pDeficit = reqs.P - P;
            const kDeficit = reqs.K - K;

            const fertilizerAdvice = {
                N: nDeficit > 0 ? `Add ${Math.round(nDeficit)} units of Nitrogen` : 'Optimal',
                P: pDeficit > 0 ? `Add ${Math.round(pDeficit)} units of Phosphorus` : 'Optimal',
                K: kDeficit > 0 ? `Add ${Math.round(kDeficit)} units of Potassium` : 'Optimal',
                summary: []
            };

            if (nDeficit > 0) fertilizerAdvice.summary.push(`Nitrogen deficiency detected for ${cropName}.`);
            if (pDeficit > 0) fertilizerAdvice.summary.push(`Phosphorus deficiency detected for ${cropName}.`);
            if (kDeficit > 0) fertilizerAdvice.summary.push(`Potassium deficiency detected for ${cropName}.`);
            if (fertilizerAdvice.summary.length === 0) fertilizerAdvice.summary.push(`Soil nutrient levels are optimal for ${cropName}.`);

            const date = new Date();
            date.setDate(date.getDate() - (index * 7)); // Spread over several weeks

            return {
                user: user._id,
                inputs: { N, P, K, temperature, humidity, ph, rainfall },
                prediction: {
                    crop: cropName.charAt(0).toUpperCase() + cropName.slice(1),
                    irrigation: Math.random() > 0.5 ? 'Drip Irrigation' : 'Sprinkler Irrigation',
                    yield: estimatedYield.toFixed(2),
                    marketPrice: pricePerTon,
                    estimatedRevenue: Math.round(estimatedRevenue),
                    marketTrend: Math.random() > 0.6 ? 'Up' : (Math.random() > 0.5 ? 'Down' : 'Stable')
                },
                fertilizer: fertilizerAdvice,
                createdAt: date
            };
        });

        await Recommendation.insertMany(recommendations);
        console.log(`Successfully seeded ${recommendations.length} recommendations for ${email}`);

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

seedData();
