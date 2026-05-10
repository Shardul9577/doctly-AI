import express from 'express';
import profileController from '../controller/profile.controller.js';
import { validateProfileUpdate } from '../validations/profile.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import upload from '../../../../config/cloudinary.config.js';

const router = express.Router();

router.put(
  '/',
  authenticate,
  authorize(['patient']),
  upload.single('profile_picture'),
  validateProfileUpdate,
  validateRequest,
  profileController.updateProfile
);

router.get('/', authenticate, profileController.getProfile);

router.get(
  '/reports',
  authenticate,
  authorize(['patient']),
  profileController.getAllReports
);

router.get(
  '/reports/:id',
  authenticate,
  authorize(['patient']),
  profileController.getReportById
);

export default router;
