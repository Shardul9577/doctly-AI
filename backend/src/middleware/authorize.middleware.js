import { MESSAGES } from '../config/constant.common.js';

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req?.user;

      if (!user) {
        return res.status(401).json({
          status: false,
          message: MESSAGES.AUTH_TOKEN_REQUIRED,
        });
      }

      if (!allowedRoles.includes(user?.role)) {
        return res.status(403).json({
          status: false,
          message: `Access denied. Only ${allowedRoles.join(', ')} roles are allowed.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
