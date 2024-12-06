import mongoose from 'mongoose';

// Define Routine Schema
export const routineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Boolean, default: false },
  actions: [{
    target: {
      type: String,
      enum: ['switch', 'outlet'], // Target (switch or outlet)
      required: true
    },
    targetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'target'
    }, // ID of the device (switch or outlet)
  }],
  schedule: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday',
       'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    }],
    moduleType: { type: String, required: true },
    moduleConfig: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'moduleType'
    }
  }
});

const getRoutineModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('Routine', routineSchema);
};

export default getRoutineModel;