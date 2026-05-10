import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_RESET_SECRET,
} from '../config/env.config.js';

// Access token valid for 15 minutes
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      abha_id: user.abha_id,
    },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
}

// Refresh token valid for 7 days
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export async function verifyRefreshToken(token) {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return resolve({
          code: 401,
          result: {
            status: false,
            message: 'Invalid or expired refresh token.',
          },
        });
      }

      return resolve({
        code: 200,
        result: {
          status: true,
          ...decoded,
        },
      });
    });
  });
}

export const generateResetToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_RESET_SECRET,
    { expiresIn: '15m' } // reset link valid for 15 minutes
  );
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, JWT_RESET_SECRET);
};
