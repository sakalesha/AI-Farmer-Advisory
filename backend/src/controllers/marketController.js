const axios = require('axios');

// Static fallback prices in INR/Quintal (modal mandi prices)
const STATIC_PRICES_INR = {
    rice: 2200, maize: 1500, chickpea: 5500, kidneybeans: 8500,
    pigeonpeas: 6200, mothbeans: 7800, mungbean: 9200, blackgram: 7100,
    lentil: 7800, pomegranate: 10600, banana: 4200, mango: 8500,
    grapes: 14200, watermelon: 2800, muskmelon: 3500, apple: 12700,
    orange: 9900, papaya: 5700, coconut: 24800, cotton: 11300,
    jute: 4900, coffee: 28400
};

// Agmarknet API commodity name lookup
const API_CROP_MAP = {
    rice: 'Paddy(Dhan)(Basmati)', maize: 'Maize',
    chickpea: 'Bengal Gram(Gram)(Whole)', kidneybeans: 'Rajgir',
    pigeonpeas: 'Arhar (Tur/Red Gram)(Whole)', mothbeans: 'Moth Dal',
    mungbean: 'Green Gram (Moong)(Whole)', blackgram: 'Black Gram (Urd Beans)(Whole)',
    lentil: 'Masur Dal', pomegranate: 'Pomegranate', banana: 'Banana',
    mango: 'Mango', grapes: 'Grapes', watermelon: 'Water Melon',
    muskmelon: 'Karbuja(Musk Melon)', apple: 'Apple', orange: 'Orange',
    papaya: 'Papaya', coconut: 'Coconut', cotton: 'Cotton',
    jute: 'Jute', coffee: 'Coffee'
};

// ±2–5% fluctuation for demo realism on fallback
const simulate = (base) => Math.round(base * (1 + (Math.random() * 0.07 - 0.02)));

// Fetch live USD/INR rate from frankfurter.app (free, no key needed)
const getLiveExchangeRate = async () => {
    try {
        const res = await axios.get('https://api.frankfurter.app/latest?from=USD&to=INR', { timeout: 5000 });
        return res.data?.rates?.INR || 83.5;
    } catch {
        return 83.5; // fallback rate
    }
};

exports.getAllMarketPrices = async (req, res) => {
    try {
        const apiKey = process.env.DATA_GOV_API_KEY;
        let apiMarketData = {};

        // Fetch live exchange rate in parallel with market data
        const [usdToInr] = await Promise.all([
            getLiveExchangeRate()
        ]);

        if (apiKey) {
            try {
                const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=2000`;
                const response = await axios.get(url, { timeout: 12000 });
                const records = response.data?.records || [];
                
                // Grouping Logic
                records.forEach(row => {
                    const comm = row.commodity;
                    const price = parseFloat(row.modal_price);
                    if (comm && !isNaN(price)) {
                        if (!apiMarketData[comm]) apiMarketData[comm] = [];
                        apiMarketData[comm].push({
                            state: row.state,
                            district: row.district,
                            market: row.market,
                            price: price
                        });
                    }
                });
                console.log(`✅ Data.gov.in API: ${records.length} records parsed | USD/INR: ${usdToInr}`);
            } catch (apiErr) {
                console.warn('⚠️ Data.gov.in API failed, using simulation:', apiErr.message);
            }
        }

        const result = Object.entries(API_CROP_MAP).map(([cropKey, apiName]) => {
            const staticBase = STATIC_PRICES_INR[cropKey] || 3500;
            const records = apiMarketData[apiName] || [];

            let inrPerQuintal, bestMandi = null, regionalData = [];

            if (records.length > 0) {
                // Calculate Average
                const sum = records.reduce((acc, r) => acc + r.price, 0);
                inrPerQuintal = Math.round(sum / records.length);

                // Find Best Mandi (Max Price)
                const sorted = [...records].sort((a, b) => b.price - a.price);
                bestMandi = sorted[0];

                // Group by State for Top 5
                const stateGroups = records.reduce((acc, r) => {
                    if (!acc[r.state]) acc[r.state] = { count: 0, sum: 0 };
                    acc[r.state].count++;
                    acc[r.state].sum += r.price;
                    return acc;
                }, {});

                regionalData = Object.entries(stateGroups)
                    .map(([state, data]) => ({ state, avg: Math.round(data.sum / data.count) }))
                    .sort((a, b) => b.avg - a.avg)
                    .slice(0, 5);

            } else {
                inrPerQuintal = simulate(staticBase);
                bestMandi = { state: 'Simulated', district: 'National', market: 'Baseline', price: inrPerQuintal };
                regionalData = [{ state: 'National', avg: inrPerQuintal }];
            }

            // INR/Ton conversion (×10)
            const inrPerTon = inrPerQuintal * 10;
            const usdPerTon = parseFloat((inrPerTon / usdToInr).toFixed(2));

            // Trend vs static baseline
            const diff = inrPerQuintal - staticBase;
            const trend = diff > staticBase * 0.05 ? 'Up' : diff < -staticBase * 0.05 ? 'Down' : 'Stable';

            return {
                crop: cropKey,
                inr_per_quintal: inrPerQuintal,
                inr_per_ton: inrPerTon,
                current_price: usdPerTon,   // kept for backward compat
                trend,
                best_mandi: bestMandi,
                regional_data: regionalData,
                usd_to_inr: usdToInr
            };
        });

        res.status(200).json({
            status: 'success',
            data: result,
            meta: { usd_to_inr: usdToInr, currency: 'INR', unit: 'per quintal (100kg)' }
        });

    } catch (error) {
        console.error('❌ Market price error:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to fetch market prices' });
    }
};
