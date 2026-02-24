const axios = require('axios');

exports.getWeather = async (req, res) => {
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
};
