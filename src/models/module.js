const mongoose = require('mongoose');

// Define Module Schema
const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

// Define Module Model
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
