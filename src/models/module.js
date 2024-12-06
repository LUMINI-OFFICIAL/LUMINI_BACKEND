import mongoose from 'mongoose';

// Define Module Schema
const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

const getModuleModel = async (tenant) => {
  let dbName = "lumini_" + tenant;
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('Module', moduleSchema);
};

export default getModuleModel;
