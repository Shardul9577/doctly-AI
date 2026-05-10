import { body } from 'express-validator';
import moment from 'moment';

export const validateCreateVisit = [
  body('visit_date')
    .notEmpty()
    .withMessage('Visit date is required')
    .custom((value) => {
      if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
        throw new Error('Birth date must be in DD/MM/YYYY format');
      }
      return true;
    }),

  body('visit_time')
    .notEmpty()
    .withMessage('Visit time is required')
    .custom((value) => {
      if (!moment(value, ['HH:mm', 'h:mm A'], true).isValid()) {
        throw new Error(
          'Invalid time format. Use HH:mm or h:mm A (e.g., 4:30 pm)'
        );
      }
      return true;
    }),

  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('visit_type')
    .notEmpty()
    .withMessage('Visit type is required')
    .isString()
    .withMessage('Visit type must be a string'),

  body('case_file_type')
    .notEmpty()
    .withMessage('Case file is required')
    .isIn(['new', 'old'])
    .withMessage('Case file must be "new" or "old"'),

  body('symptoms')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      }
      return value;
    })
    .isArray()
    .withMessage('Symptoms must be an array of strings'),

  body('notes').optional().isString().withMessage('Notes must be a string'),

  body('patient_id')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isMongoId()
    .withMessage('Invalid patient ID'),
];

export const validateVisitUpdate = [
  body('visit_date')
    .optional()
    .isString()
    .withMessage('visit_date must be a string'),
  body('visit_time')
    .optional()
    .isString()
    .withMessage('visit_time must be a string'),
  body('duration')
    .optional()
    .isString()
    .withMessage('duration must be a string'),
  body('visit_type')
    .optional()
    .isString()
    .withMessage('visit_type must be a string'),
  body('case_file_type')
    .optional()
    .isString()
    .withMessage('case_file_type must be a string'),
  body('status').optional().isString().withMessage('status must be a string'),
  body('notes').optional().isString().withMessage('notes must be a string'),
  body('deletedAttachments')
    .optional()
    .isString()
    .withMessage('deletedAttachments must be a JSON string')
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      }
      return value;
    })
    .isArray()
    .withMessage('deletedAttachments must be an array'),
  body('diagnosis')
    .optional()
    .customSanitizer((value, { req }) => {
      // Handle JSON string input (e.g., from raw/form-data string field)
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          return [value]; // fallback if it's just a single string like 'cold'
        }
      }

      // Handle case where diagnosis is sent as diagnosis[0], diagnosis[1]...
      if (Array.isArray(value)) return value;

      return [value]; // if just a single value like diagnosis = 'cold'
    })
    .isArray({ min: 1 })
    .withMessage('Diagnosis must be an array')
    .bail()
    .custom((arr) => {
      const allStrings = arr.every((item) => typeof item === 'string');
      if (!allStrings) {
        throw new Error('All diagnosis items must be strings');
      }
      return true;
    }),

  body('symptoms')
    .optional()
    .customSanitizer((value, { req }) => {
      // Handle JSON string input (e.g., from raw/form-data string field)
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          return [value]; // fallback if it's just a single string like 'fever'
        }
      }

      // Handle case where symptoms are sent as symptoms[0], symptoms[1]...
      if (Array.isArray(value)) return value;

      return [value]; // if just a single value like symptoms = 'fever'
    })
    .isArray({ min: 1 })
    .withMessage('Symptoms must be an array')
    .bail()
    .custom((arr) => {
      const allStrings = arr.every((item) => typeof item === 'string');
      if (!allStrings) {
        throw new Error('All symptoms must be strings');
      }
      return true;
    }),

  body('prescription')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
          throw new Error('Prescription must be an array');
        }

        parsed.forEach((item, index) => {
          if (typeof item !== 'object' || item === null) {
            throw new Error(
              `Prescription item at index ${index} must be an object`
            );
          }

          const requiredFields = [
            'medicine_name',
            'dosage',
            'duration',
            'instructions',
          ];

          for (const field of requiredFields) {
            if (!item[field] || typeof item[field] !== 'string') {
              throw new Error(
                `Prescription[${index}].${field} must be a string`
              );
            }
          }
        });

        return true;
      } catch (err) {
        throw new Error(
          err.message ||
            'Prescription must be a valid JSON array with proper fields'
        );
      }
    }),
];
