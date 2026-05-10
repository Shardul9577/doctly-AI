import { body } from 'express-validator';
import moment from 'moment';

export const validateNewPatient = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name should contain only letters'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name should contain only letters'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 0 })
    .withMessage('Age must be a positive number'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be between 10 and 15 digits')
    .matches(/^[0-9]+$/)
    .withMessage('Phone must contain only digits'),

  body('personal_address')
    .optional()
    .isString()
    .withMessage('Personal address must be a string'),
];

export const validateUpdatePatient = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name should contain only letters'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name should contain only letters'),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 0 })
    .withMessage('Age must be a positive number'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be between 10 and 15 digits')
    .matches(/^[0-9]+$/)
    .withMessage('Phone must contain only digits'),

  body('about')
    .optional()
    .isString()
    .trim()
    .withMessage('About must be a string'),

  body('birth_date')
    .optional()
    .custom((value) => {
      if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
        throw new Error('Birth date must be in DD/MM/YYYY format');
      }
      return true;
    }),

  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be one of: male, female, other'),

  body('marital_status')
    .optional()
    .isIn(['single', 'married', 'divorced', 'widowed'])
    .withMessage(
      'Marital status must be one of: single, married, divorced, widowed'
    ),

  body('spouse_full_name')
    .optional()
    .isString()
    .withMessage('Spouse full name must be a string'),

  body('personal_address')
    .optional()
    .isString()
    .withMessage('Personal address must be a string'),
];
