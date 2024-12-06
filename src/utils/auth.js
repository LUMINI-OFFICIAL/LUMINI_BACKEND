import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Middleware function to authenticate and authorize requests
const authenticateToken = (req, res, next) => {
  const token = req.query.token || req.headers['authorization'].split(' ')[1];

  if (!token) {
    if (res) {
      return res.status(401).json({ message: 'No token provided' });
    } else {
      return next(new Error('No token provided'));
    }
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (res) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      } else {
        return next(new Error('Failed to authenticate token'));
      }
    }
    req.user = user;
    if (next) next();
  });
};

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to hash password using bcrypt
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to compare hashed password with plain password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { authenticateToken, generateToken, hashPassword, comparePassword };
