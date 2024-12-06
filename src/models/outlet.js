import mongoose from 'mongoose';

// Define Outlet Schema
const outletSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Boolean, default: false },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  moduleType: { type: String, required: true },
  moduleConfig: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'moduleType'
  } // Configuration of the module connected to the outlet (raw JSON)
});

const getOutletModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('Outlet', outletSchema);
};

export default getOutletModel;
