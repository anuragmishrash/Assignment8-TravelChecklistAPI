const TravelItem = require('../models/TravelItem');
const { validationResult } = require('express-validator');

// @desc    Get all travel items for a user
// @route   GET /api/travel-items
// @access  Private
exports.getTravelItems = async (req, res, next) => {
  try {
    const travelItems = await TravelItem.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: travelItems.length,
      data: travelItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single travel item
// @route   GET /api/travel-items/:id
// @access  Private
exports.getTravelItem = async (req, res, next) => {
  try {
    const travelItem = await TravelItem.findById(req.params.id);

    if (!travelItem) {
      return res.status(404).json({
        success: false,
        message: 'Travel item not found'
      });
    }

    // Check if the travel item belongs to the user
    if (travelItem.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this travel item'
      });
    }

    res.status(200).json({
      success: true,
      data: travelItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new travel item
// @route   POST /api/travel-items
// @access  Private
exports.createTravelItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    // Add user ID to request body
    req.body.user = req.user.id;
    
    // Check for uploaded file
    if (req.file) {
      req.body.imagePath = req.file.path;
    }

    const travelItem = await TravelItem.create(req.body);

    res.status(201).json({
      success: true,
      data: travelItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a travel item
// @route   PUT /api/travel-items/:id
// @access  Private
exports.updateTravelItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    let travelItem = await TravelItem.findById(req.params.id);

    if (!travelItem) {
      return res.status(404).json({
        success: false,
        message: 'Travel item not found'
      });
    }

    // Check if the travel item belongs to the user
    if (travelItem.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this travel item'
      });
    }

    // Check for uploaded file
    if (req.file) {
      req.body.imagePath = req.file.path;
    }

    travelItem = await TravelItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: travelItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a travel item
// @route   DELETE /api/travel-items/:id
// @access  Private
exports.deleteTravelItem = async (req, res, next) => {
  try {
    const travelItem = await TravelItem.findById(req.params.id);

    if (!travelItem) {
      return res.status(404).json({
        success: false,
        message: 'Travel item not found'
      });
    }

    // Check if the travel item belongs to the user
    if (travelItem.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this travel item'
      });
    }

    await TravelItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 