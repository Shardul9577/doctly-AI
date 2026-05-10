import express from 'express';
import authController from '../controller/auth.controller.js';
import { validateRequest } from '../../../middleware/error.middleware.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import {
  registerUserValidator,
  emailVerifyValidator,
  loginValidation,
  refreshTokenValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidator,
} from '../validations/auth.validation.js';

const router = express.Router();

router.post(
  '/register',
  registerUserValidator,
  validateRequest,
  authController.register
);

router.get(
  '/verify-email',
  emailVerifyValidator,
  validateRequest,
  authController.verifyEmail
);

router.post('/login', loginValidation, validateRequest, authController.login);

router.post(
  '/refresh-token',
  authenticate,
  refreshTokenValidation,
  validateRequest,
  authController.refreshToken
);

router.post(
  '/forgot-password',
  forgetPasswordValidation,
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  authController.resetPassword
);

router.put(
  '/password/update',
  authenticate,
  updatePasswordValidator,
  validateRequest,
  authController.updatePassword
);

export default router;
