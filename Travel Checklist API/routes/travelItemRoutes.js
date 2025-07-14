const express = require('express');
const { check } = require('express-validator');
const { 
  getTravelItems, 
  getTravelItem, 
  createTravelItem, 
  updateTravelItem, 
  deleteTravelItem 
} = require('../controllers/travelItemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all travel items and create a new travel item
router.route('/')
  .get(getTravelItems)
  .post(
    upload.single('image'),
    [
      check('itemName', 'Item name is required').not().isEmpty(),
      check('destinationCity', 'Destination city is required').not().isEmpty()
    ],
    createTravelItem
  );

// Get, update and delete a single travel item
router.route('/:id')
  .get(getTravelItem)
  .put(
    upload.single('image'),
    [
      check('itemName', 'Item name is required').optional().not().isEmpty(),
      check('destinationCity', 'Destination city is required').optional().not().isEmpty()
    ],
    updateTravelItem
  )
  .delete(deleteTravelItem);

module.exports = router; 