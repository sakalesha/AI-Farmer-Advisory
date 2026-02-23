const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const User = require('./models/User');
const Recommendation = require('./models/Recommendation');
const authController = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB Connection (Cached for Serverless)
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Render Unified Server is running' });
});

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// GET /api/weather
app.get('/api/weather', protect, async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;

        if (!lat || !lon) {
            return res.status(400).json({ status: 'error', message: 'Latitude and longitude are required' });
        }

        if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
            return res.json({
                status: 'success',
                mode: 'simulation',
                data: {
                    temp: 24 + Math.random() * 8,
                    humidity: 60 + Math.random() * 20,
                    rainfall: 80 + Math.random() * 150
                }
            });
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(weatherUrl);
        const rain = response.data.rain ? (response.data.rain['1h'] || 0) : 0;

        res.json({
            status: 'success',
            mode: 'live',
            data: {
                temp: response.data.main.temp,
                humidity: response.data.main.humidity,
                rainfall: rain * 100
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Recommendation Route
app.post('/api/recommend', protect, async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

        // Internal call to Python service running on port 5001
        const ML_SERVICE_PORT = process.env.ML_SERVICE_PORT || 5001;
        const ML_URL = `http://127.0.0.1:${ML_SERVICE_PORT}/api/predict`;

        const mlResponse = await axios.post(ML_URL, {
            N, P, K, temperature, humidity, ph, rainfall
        });

        const { crop, irrigation } = mlResponse.data;

        const newRecord = new Recommendation({
            user: req.user._id,
            inputs: { N, P, K, temperature, humidity, ph, rainfall },
            prediction: { crop, irrigation }
        });

        await newRecord.save();

        res.json({
            status: 'success',
            crop,
            irrigation,
            recordId: newRecord._id
        });
    } catch (error) {
        console.error('❌ Error in /api/recommend:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// History Route
app.get('/api/history', protect, async (req, res) => {
    try {
        const history = await Recommendation.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Fallback for SPA routing: serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Standalone server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Unified Node server running on port ${PORT}`);
});

module.exports = app;
