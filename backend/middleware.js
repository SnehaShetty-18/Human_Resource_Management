import jwt from 'jsonwebtoken';
import pool from './db.js';

// Middleware to check if user has HR or Admin role
export const requireHR = async (req, res, next) => {
  try {
    // In a real implementation, you would verify the JWT token and check user role
    // For now, I'll implement proper role verification based on the token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      
      // Fetch user role from database to check if it's HR or Admin
      const [userResult] = await pool.execute(
        'SELECT role_id FROM users WHERE employee_id = ?',
        [decoded.employee_id]
      );
      
      if (userResult.length === 0) {
        return res.status(401).json({ message: 'User not found.' });
      }
      
      // Fetch role name to determine if it's HR or Admin
      const [roleResult] = await pool.execute(
        'SELECT role_name FROM roles WHERE id = ?',
        [userResult[0].role_id]
      );
      
      if (roleResult.length === 0) {
        return res.status(403).json({ message: 'Access denied. Role information not found.' });
      }
      
      const roleName = roleResult[0].role_name.toUpperCase();
      if (roleName !== 'ADMIN' && roleName !== 'HR') {
        return res.status(403).json({ message: 'Access denied. HR or Admin role required.' });
      }
      
      req.user = decoded; // Add user info to request object
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error in role verification' });
  }
};

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};