import mongoose from 'mongoose';

// Define RGB Schema
const rgbSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // Reference to the RGB configuration type
  config: {
    red: { type: Number, required: true, min: 0, max: 255 }, // Red value (0-255)
    green: { type: Number, required: true, min: 0, max: 255 }, // Green value (0-255)
    blue: { type: Number, required: true, min: 0, max: 255 } // Blue value (0-255)
  }
});

const getRGBModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('RGB', rgbSchema);
};

export default getRGBModel;