const mongoose = require('mongoose');

const TravelItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please add an item name'],
    trim: true
  },
  destinationCity: {
    type: String,
    required: [true, 'Please add a destination city'],
    trim: true
  },
  isPacked: {
    type: Boolean,
    default: false
  },
  imagePath: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('TravelItem', TravelItemSchema); 