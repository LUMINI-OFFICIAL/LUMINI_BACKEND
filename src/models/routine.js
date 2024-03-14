const mongoose = require('mongoose');

// Define Routine Schema
const routineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  routineType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RoutineType', required: true 
  }, // Reference to the routine type
  actions: [{
    type: {
      type: String,
      enum: ['switch', 'outlet'], // Type of action (switch or outlet)
      required: true
    },
    deviceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    }, // ID of the device (switch or outlet)
  }]
});

// Define Routine Model
const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;
