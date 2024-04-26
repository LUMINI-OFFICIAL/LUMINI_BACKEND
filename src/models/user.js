const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
