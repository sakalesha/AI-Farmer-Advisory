const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, recommendController.getRecommendation);

module.exports = router;
