import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Middleware function to authenticate and authorize requests
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
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
