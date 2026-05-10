import { validationResult } from 'express-validator';

export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    status: false,
    message: err.message || 'Internal Server Error',
  });
}

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
}
