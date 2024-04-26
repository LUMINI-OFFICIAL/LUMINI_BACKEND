const mongoose = require('mongoose');

// Define Routine Schema
const routineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  actions: [{
    state: { type: Boolean, default: true },
    target: {
      type: String,
      enum: ['switch', 'outlet'], // Target (switch or outlet)
      required: true
    },
    targetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    }, // ID of the device (switch or outlet)
  }],
  schedule: {
    startTime: { type: String, required: true },
    endTime: { type:String, required: true },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday',
       'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    }]
  }
});

// Define Routine Model
const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;
