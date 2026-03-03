const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Route to get all prices
router.get('/prices/all', marketController.getAllMarketPrices);

module.exports = router;
