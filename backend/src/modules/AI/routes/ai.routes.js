import express from 'express';
import { audioUpload } from '../../../config/multer.config.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';
import {
  generateConsultation,
  generateReport,
} from '../controller/ai.controller.js';

const router = express.Router();

// Public AI consultation proxy. The provider API key stays server-side.
router.post('/consultation', generateConsultation);

// Apply authentication middleware to all routes
router.use(authenticate);

// Generate report with audio transcription and image analysis
// Note: authenticate is already applied to all routes with router.use(authenticate)
router.post(
  '/generate-report',
  authorize(['doctor']),
  audioUpload.single('audioFile'),
  generateReport
);

// Get report by ID
// router.get(
//   '/report/:reportId',
//   authorize(['doctor', 'patient']),
//   getReportById
// );

export default router;
