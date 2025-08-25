const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({
      message: 'No token provided. Access forbidden.',
    });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      message: 'No token provided. Access forbidden.',
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token. Unauthorized.',
    });
  }
};

module.exports = {
  verifyToken,
  SECRET_KEY,
  verifyAdmin: (req, res, next) => {
    // In this app, admin is represented by role === false (see ProtectedRoute usage)
    if (!req.user || req.user.role !== false) {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  }
};
