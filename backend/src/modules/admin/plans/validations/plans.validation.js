import { body, param, query } from 'express-validator';

export const createPlan = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plan name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Plan name must be between 2 and 100 characters'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('token_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Token limit must be a positive integer'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('features.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Feature cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Feature must be between 2 and 100 characters'),

  body('billing_cycle')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Billing cycle must be either monthly or yearly'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

// Get plans list validation
export const getPlansList = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),

  query('is_active')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('is_active must be true or false'),

  query('billing_cycle')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Billing cycle must be either monthly or yearly'),

  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'created_at', 'token_limit'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// Get plan by ID validation
export const getPlanById = [
  param('id').isMongoId().withMessage('Invalid plan ID'),
];

// Update plan validation
export const updatePlan = [
  param('id').isMongoId().withMessage('Invalid plan ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Plan name must be between 2 and 100 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('token_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Token limit must be a positive integer'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('features.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Feature cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Feature must be between 2 and 100 characters'),

  body('billing_cycle')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Billing cycle must be either monthly or yearly'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

// Delete plan validation
export const deletePlan = [
  param('id').isMongoId().withMessage('Invalid plan ID'),
];

// Toggle plan status validation
export const togglePlanStatus = [
  param('id').isMongoId().withMessage('Invalid plan ID'),
];
