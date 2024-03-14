const mongoose = require('mongoose');

// Define RGB Schema
const rgbSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // Reference to the RGB configuration type
  config: {
    red: { type: Number, required: true, min: 0, max: 255 }, // Red value (0-255)
    green: { type: Number, required: true, min: 0, max: 255 }, // Green value (0-255)
    blue: { type: Number, required: true, min: 0, max: 255 } // Blue value (0-255)
  }
});

// Define RGBConfig Model
const RGB = mongoose.model('RGB', rgbSchema);

module.exports = RGB;
