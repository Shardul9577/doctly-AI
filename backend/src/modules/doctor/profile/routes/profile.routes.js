import express from 'express';
import profileController from '../controller/profile.controller.js';
import {
  validateProfileUpdate,
  personalDetailsValidator,
  organizationValidator,
  rejectReportValidator,
} from '../validations/profile.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import upload from '../../../../config/cloudinary.config.js';

const router = express.Router();

router.put(
  '/',
  authenticate,
  authorize(['doctor']),
  upload.single('profile_picture'),
  validateProfileUpdate,
  validateRequest,
  profileController.updateProfile
);

router.get('/', authenticate, profileController.getProfile);

router.post(
  '/personal-info',
  authenticate,
  authorize(['doctor']),
  upload.fields([
    { name: 'degree_file', maxCount: 1 },
    { name: 'aadhaar_card_file', maxCount: 1 },
    { name: 'pan_card_file', maxCount: 1 },
  ]),
  personalDetailsValidator,
  validateRequest,
  profileController.addOrUpdateDegreeInfo
);

router.get(
  '/personal-info',
  authenticate,
  authorize(['doctor']),
  profileController.getDoctorDegreeInfo
);

router.get(
  '/about',
  authenticate,
  authorize(['doctor']),
  profileController.getDoctorFullProfileDetails
);

router.post(
  '/organization',
  authenticate,
  authorize(['doctor']),
  organizationValidator,
  validateRequest,
  profileController.addOrUpdateOrganization
);

router.get(
  '/organization',
  authenticate,
  authorize(['doctor']),
  profileController.getDoctorOrganizationDetails
);

router.post(
  '/reject-report',
  authenticate,
  authorize(['doctor']),
  rejectReportValidator,
  validateRequest,
  profileController.rejectReport
);

export default router;
