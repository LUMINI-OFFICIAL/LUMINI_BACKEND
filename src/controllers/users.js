import mongoose from 'mongoose';
import createError from "http-errors";
import { makeResponse } from "@/utils/response";
import { generateToken, comparePassword, hashPassword  } from '@/utils/auth';
import getUserModel from '@/models/user';

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const User = await getUserModel();
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return makeResponse({ res, status: 400, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return makeResponse({ res, status: 201, data: newUser });
  } catch (error) {
    console.error(error.message);
    return makeResponse({ res, status: 500, message: 'Internal server error' });
  }
};

// Function to log in a user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) throw new Error("Invalid request body");
    
    const User = await getUserModel();
    
    // Find the user by username
    const user = await User.findOne({ username: username.toLowerCase() });

    // If user not found or password does not match, throw error
    if (!user || !(await comparePassword(password, user.password))) {
      return makeResponse({res, status: 403, message: 'Invalid username or password'});
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id });

    return makeResponse({res, status: 200, data: token});
  } catch (error) {
    console.error(error.message);
    return makeResponse({res, status: 500, message:'Internal server error'});
  }
};

// Function to log out a user (not much to do here as it's stateless)
export const logout = (req, res) => {
  mongoose.connection.close();
  return makeResponse({res, status: 200, message: 'Logout successful' });
};
