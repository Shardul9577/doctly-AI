import express from 'express';
import { validateRequest } from '../../../middleware/error.middleware.js';
import contactController from '../controller/contact.controller.js';
import { contactUsValidator } from '../validations/contact.validation.js';

const router = express.Router();

router.post(
  '/contact-us',
  contactUsValidator,
  validateRequest,
  contactController.contactUs
);

export default router;
