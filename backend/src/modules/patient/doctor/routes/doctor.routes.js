import express from 'express';
import doctorsController from '../controller/doctor.controller.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorize(['patient']),
  doctorsController.getDoctors
);

export default router;
