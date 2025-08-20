import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return res.status(401).json({ message: 'Unauthorized no token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);

    // Fix: decoded may use _id or id, fallback to both
    const userId = decoded.userId || decoded._id || decoded.id;
    const user = await User.findById(userId);

    if(!user) return res.status(401).json({ message: 'Unauthorized, no user found' });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}


export default authMiddleware;