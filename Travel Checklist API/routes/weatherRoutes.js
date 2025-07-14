const express = require('express');
const { getWeather } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect the route
router.use(protect);

// Get weather data
router.get('/', getWeather);

module.exports = router; 