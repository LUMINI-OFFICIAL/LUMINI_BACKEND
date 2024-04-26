import mongoose from 'mongoose';
import createError from "http-errors";
import User from "@/models/user";
import { makeResponse } from "@/utils/response";
import { generateToken, comparePassword, hashPassword  } from '@/utils/auth';

// Function to register a new user
export const registerUser = async (username, password) => {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

// Function to log in a user
export const login = async (username, password) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found or password does not match, throw error
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken({ username: user.username });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

// Function to log out a user (not much to do here as it's stateless)
export const logout = () => {
  return { message: 'Logout successful' };
};
