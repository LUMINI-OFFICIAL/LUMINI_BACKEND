const mongoose = require('mongoose');

// Define Outlet Schema
const outletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: Boolean, default: false },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  moduleType: { type: String, required: true },
  moduleConfig: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'moduleType',
    required: true
  } // Configuration of the module connected to the outlet (raw JSON)
});

// Define Outlet Model
const Outlet = mongoose.model('Outlet', outletSchema);

module.exports = Outlet;
