import jwt from 'jsonwebtoken';
import { MESSAGES } from '../config/constant.common.js';
import { JWT_SECRET } from '../config/env.config.js';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: MESSAGES.AUTH_TOKEN_REQUIRED,
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: MESSAGES.INVALID_TOKEN,
        });
      }

      // Optional: check if user still exists
      const user = await User.findById(decoded.id).select(
        '_id role firstName lastName email'
      ); // Exclude sensitive fields
      if (!user) {
        return res.status(404).json({
          status: false,
          message: MESSAGES.USER_NOT_FOUND,
        });
      }

      req['user'] = user; // Attach user info to request
      next();
    });
  } catch (error) {
    next(error);
  }
};
