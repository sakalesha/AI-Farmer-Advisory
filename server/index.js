const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const User = require('./models/User');
const Recommendation = require('./models/Recommendation');
const authController = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MERN Server is running' });
});

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// GET /api/weather (Protected proxy to OpenWeatherMap)
app.get('/api/weather', protect, async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;

        if (!lat || !lon) {
            return res.status(400).json({ status: 'error', message: 'Latitude and longitude are required' });
        }

        // SIMULATION MODE: If API key is missing or the placeholder
        if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
            console.log('🌦️ Weather API: Simulation Mode Active');
            return res.json({
                status: 'success',
                mode: 'simulation',
                data: {
                    temp: 24 + Math.random() * 8, // 24-32°C
                    humidity: 60 + Math.random() * 20, // 60-80%
                    rainfall: 80 + Math.random() * 150 // 80-230mm
                }
            });
        }

        // REAL MODE
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(weatherUrl);

        // Extract relevant data (Rainfall is often in 'rain' object, volume for last 1h)
        const rain = response.data.rain ? (response.data.rain['1h'] || 0) : 0;

        res.json({
            status: 'success',
            mode: 'live',
            data: {
                temp: response.data.main.temp,
                humidity: response.data.main.humidity,
                rainfall: rain * 100 // Scale to mm for our model's rainfall parameter if needed
            }
        });

    } catch (error) {
        console.error('❌ Error in /api/weather:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch weather data.',
            details: error.response?.data?.message || error.message
        });
    }
});

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Protected Recommendation Routes
app.post('/api/recommend', protect, async (req, res) => {
    try {
        const payload = req.body;
        
        // Call ML Microservice
        const mlResponse = await axios.post(`${ML_URL}/predict`, payload);

        const { crop, irrigation } = mlResponse.data;

        // 2. Save to MongoDB (tied to user)
        const newRecord = new Recommendation({
            user: req.user._id,
            inputs: { N, P, K, temperature, humidity, ph, rainfall },
            prediction: { crop, irrigation }
        });

        await newRecord.save();

        // 3. Return response
        res.json({
            status: 'success',
            crop,
            irrigation,
            recordId: newRecord._id
        });

    } catch (error) {
        console.error('❌ Error in /api/recommend:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to process recommendation.',
            details: error.message
        });
    }
});

// GET /api/history (tied to user)
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
