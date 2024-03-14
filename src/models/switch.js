import mongoose from 'mongoose';

// Define Switch Schema
const switchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: Boolean, default: false },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
});

// Define Switch Model
const Switch = mongoose.model('Switch', switchSchema);

module.exports = Switch;
