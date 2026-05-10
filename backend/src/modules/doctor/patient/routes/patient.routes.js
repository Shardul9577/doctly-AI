import express from 'express';
import patientController from '../controller/patient.controller.js';
import {
  validateNewPatient,
  validateUpdatePatient,
} from '../validations/patient.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';

const router = express.Router();

// Add new patient
router.post(
  '/',
  authenticate,
  authorize(['doctor']),
  validateNewPatient,
  validateRequest,
  patientController.addNewPatient
);

// Update existing patient
router.put(
  '/:id',
  authenticate,
  authorize(['doctor']),
  validateUpdatePatient,
  validateRequest,
  patientController.updatePatient
);

// Get doctors's patient lists
router.get(
  '/list',
  authenticate,
  authorize(['doctor']),
  patientController.getPatientLists
);

// Get patient details
router.get(
  '/:id',
  authenticate,
  authorize(['doctor']),
  patientController.getPatientById
);

// Get all patient lists
router.get(
  '/all/lists',
  authenticate,
  authorize(['doctor']),
  patientController.getAllPatientLists
);

// add existing patient to doctor list
router.post(
  '/connect/:id',
  authenticate,
  authorize(['doctor']),
  patientController.connectExistingPatient
);

// Disconnect patient from doctor
router.delete(
  '/disconnect/:id',
  authenticate,
  authorize(['doctor']),
  patientController.disconnectExistingPatient
);

export default router;
