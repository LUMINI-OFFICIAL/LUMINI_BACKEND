import mongoose from 'mongoose';

// Define Switch Schema
const switchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Boolean, default: false },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
});

const getSwitchModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('Switch', switchSchema);
};

export default getSwitchModel;