/**
 * Optimal N-P-K requirements for the 22 crops in the dataset.
 * Values are approximate and standardized for the advisory system.
 * Format: [Nitrogen, Phosphorus, Potassium]
 */
const cropRequirements = {
    'rice': { N: 80, P: 40, K: 40 },
    'maize': { N: 100, P: 50, K: 50 },
    'chickpea': { N: 40, P: 60, K: 80 },
    'kidneybeans': { N: 30, P: 50, K: 30 },
    'pigeonpeas': { N: 25, P: 50, K: 25 },
    'mothbeans': { N: 20, P: 40, K: 20 },
    'mungbean': { N: 20, P: 40, K: 20 },
    'blackgram': { N: 25, P: 50, K: 25 },
    'lentil': { N: 25, P: 50, K: 25 },
    'pomegranate': { N: 100, P: 50, K: 50 },
    'banana': { N: 120, P: 80, K: 100 },
    'mango': { N: 100, P: 50, K: 100 },
    'grapes': { N: 100, P: 50, K: 120 },
    'watermelon': { N: 100, P: 50, K: 80 },
    'muskmelon': { N: 100, P: 50, K: 80 },
    'apple': { N: 120, P: 60, K: 120 },
    'orange': { N: 120, P: 60, K: 120 },
    'papaya': { N: 140, P: 80, K: 140 },
    'coconut': { N: 140, P: 100, K: 160 },
    'cotton': { N: 120, P: 60, K: 60 },
    'jute': { N: 80, P: 40, K: 80 },
    'coffee': { N: 140, P: 60, K: 140 }
};

module.exports = cropRequirements;
