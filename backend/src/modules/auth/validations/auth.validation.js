import { body, query } from 'express-validator';

export const registerUserValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name should contain only letters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name should contain only letters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10,15}$/)
    .withMessage('Invalid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['patient', 'doctor'])
    .withMessage('Role must be patient or doctor'),
  body('personal_address').optional().trim(),
];

export const emailVerifyValidator = [
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Token is required'),
];

export const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidation = [
  query('token').notEmpty().withMessage('Token is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updatePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
];
