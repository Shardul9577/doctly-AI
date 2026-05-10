import express from 'express';
import plansController from '../controller/plans.controller.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import {
  createPlan,
  getPlansList,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from '../validations/plans.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
const router = express.Router();

// Create a new plan
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  createPlan,
  validateRequest,
  plansController.createPlan
);

// Get all plans with pagination and filters
router.get('/', getPlansList, validateRequest, plansController.getPlansList);

// Get plan by ID
router.get(
  '/:id',
  authenticate,
  getPlanById,
  validateRequest,
  plansController.getPlanById
);

// Update plan by ID
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  updatePlan,
  validateRequest,
  plansController.updatePlan
);

// Delete plan by ID
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  deletePlan,
  validateRequest,
  plansController.deletePlan
);

// Toggle plan active status
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize(['admin']),
  togglePlanStatus,
  validateRequest,
  plansController.togglePlanStatus
);

export default router;
