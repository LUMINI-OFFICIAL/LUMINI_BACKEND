const mongoose = require('mongoose');

// Define Room Schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  switches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Switch' }],
  outlets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' }]
});

// Define Room Model
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
