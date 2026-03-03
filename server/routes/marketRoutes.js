const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware'); // Optional if you want it protected

// Route to get all prices
router.get('/prices/all', protect, marketController.getAllMarketPrices);

module.exports = router;
