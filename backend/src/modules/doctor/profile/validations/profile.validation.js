import { body } from 'express-validator';
import moment from 'moment';

export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string'),

  body('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string'),

  body('about')
    .optional()
    .isString()
    .trim()
    .withMessage('About must be a string'),

  body('age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),

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

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Phone must be a valid mobile number'),

  body('personal_address')
    .optional()
    .isString()
    .withMessage('Personal address must be a string'),

  body('social_links')
    .optional()
    .isObject()
    .withMessage('Social links must be an object'),

  body('social_links.facebook')
    .optional()
    .isString()
    .withMessage('Facebook link must be a string'),

  body('social_links.instagram')
    .optional()
    .isString()
    .withMessage('Instagram link must be a string'),

  body('social_links.twitter')
    .optional()
    .isString()
    .withMessage('Twitter link must be a string'),

  body('social_links.linkedin')
    .optional()
    .isString()
    .withMessage('LinkedIn link must be a string'),

  // 🚫 Restrict extra fields
  body().custom((body) => {
    const allowedFields = [
      'firstName',
      'lastName',
      'age',
      'phone',
      'personal_address',
      'social_links',
      'about',
      'birth_date',
      'blood_group',
      'gender',
      'marital_status',
      'spouse_full_name',
    ];
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields in request: ${invalidFields.join(', ')}`);
    }

    return true;
  }),
];

export const personalDetailsValidator = [
  body('license_number')
    .notEmpty()
    .withMessage('License number is required')
    .isString()
    .trim(),

  body('specialization')
    .notEmpty()
    .withMessage('Specialization is required')
    .isString()
    .trim(),

  body('qualification')
    .notEmpty()
    .withMessage('Qualification is required')
    .isString()
    .trim(),

  body('medical_school').optional().isString().trim(),

  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array of strings'),

  body('clinic_id')
    .optional()
    .isMongoId()
    .withMessage('Clinic ID must be a valid Mongo ID'),

  body('hospital_id')
    .optional()
    .isMongoId()
    .withMessage('Hospital ID must be a valid Mongo ID'),
];

export const organizationValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-() ]{6,20}$/)
    .withMessage('Phone must be a valid landline or mobile number'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('is_individual')
    .trim()
    .isBoolean()
    .withMessage('is_individual must be a boolean'),
];

export const rejectReportValidator = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid Mongo ID'),
];
