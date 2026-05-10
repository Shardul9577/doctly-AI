import express from 'express';
import visitController from '../controller/visit.controller.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';

const router = express.Router();

router.get(
  '/list',
  authenticate,
  authorize(['patient']),
  visitController.getVisitList
);

router.get(
  '/:id',
  authenticate,
  authorize(['patient']),
  visitController.getVisitById
);

// Get list of doctors
router.get(
  '/list/doctor',
  authenticate,
  authorize(['patient']),
  visitController.getListOfDoctors
);

router.post(
  '/book-visit',
  authenticate,
  authorize(['patient']),
  visitController.bookVisit
);

export default router;
