import mongoose from 'mongoose';

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const getUserModel = async () => {
  const dbName = 'lumini_users';
  let db = await mongoose.connection.useDb(dbName).asPromise();
  return db.model('User', userSchema);
};

export default getUserModel;