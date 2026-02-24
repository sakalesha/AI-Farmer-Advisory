/**
 * Average Market Prices per Ton (USD) for 22 crops.
 * These are used to calculate profit potential.
 * Prices are approximate global averages.
 */
const marketPrices = {
    'rice': 450,
    'maize': 300,
    'chickpea': 800,
    'kidneybeans': 1200,
    'pigeonpeas': 900,
    'mothbeans': 1100,
    'mungbean': 1300,
    'blackgram': 1000,
    'lentil': 1100,
    'pomegranate': 1500,
    'banana': 600,
    'mango': 1200,
    'grapes': 2000,
    'watermelon': 400,
    'muskmelon': 500,
    'apple': 1800,
    'orange': 1400,
    'papaya': 800,
    'coconut': 3500, // per ton equivalent
    'cotton': 1600,
    'jute': 700,
    'coffee': 4000
};

module.exports = marketPrices;
