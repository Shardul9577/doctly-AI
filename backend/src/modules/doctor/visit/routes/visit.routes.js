import express from 'express';
import visitController from '../controller/visit.controller.js';
import {
  validateCreateVisit,
  validateVisitUpdate,
} from '../validations/visit.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import upload from '../../../../config/cloudinary.config.js';

const router = express.Router();

// Add new visit of patient
router.post(
  '/',
  authenticate,
  authorize(['doctor']),
  validateCreateVisit,
  validateRequest,
  visitController.addNewVisit,
);

// Update existing visit of patient
router.patch(
  '/:id',
  authenticate,
  authorize(['doctor']),
  upload.fields([{ name: 'attachments', maxCount: 20 }]),
  validateVisitUpdate,
  validateRequest,
  visitController.updateExistingVisit,
);

// Get visit lists
router.get(
  '/list',
  authenticate,
  authorize(['doctor']),
  visitController.getVisitList,
);

router.get(
  '/list/patient-visit-approval-today',
  authenticate,
  authorize(['doctor']),
  visitController.getVisitListByPatientApprovalToday,
);

// Report list of patient (must be before /:id to avoid "report-list" being matched as id)
router.get(
  '/report-list',
  authenticate,
  authorize(['doctor']),
  visitController.getReportList,
);

router.patch(
  '/patient-visit-approval-today/:id',
  authenticate,
  authorize(['doctor']),
  visitController.approveVisit,
);

router.patch(
  '/patient-visit-rejection-today/:id',
  authenticate,
  authorize(['doctor']),
  visitController.rejectVisit,
);

// Get specific visit (/:id must be last among GETs to avoid matching specific paths)
router.get(
  '/:id',
  authenticate,
  authorize(['doctor']),
  visitController.getVisitById,
);

export default router;
