import mongoose from 'mongoose';

// Define Room Schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  switches: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Switch' }],
  outlets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' }]
});

const getRoomModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('Room', roomSchema);
};

export default getRoomModel;