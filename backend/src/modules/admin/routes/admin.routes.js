import express from 'express';
import AdminController from '../controller/admin.controller.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';
import upload from '../../../config/cloudinary.config.js';
import { validateRequest } from '../../../middleware/error.middleware.js';
import plansRoutes from '../plans/routes/plans.routes.js';

const router = express.Router();

router.get(
  '/doctors',
  authenticate,
  authorize(['admin']),
  AdminController.getDoctorsList
);

router.get(
  '/patients',
  authenticate,
  authorize(['admin']),
  AdminController.getPatientsList
);

router.get(
  '/account/my-account',
  authenticate,
  authorize(['admin']),
  AdminController.getAdminDetails
);

router.put(
  '/account',
  authenticate,
  authorize(['admin']),
  upload.single('profile_picture'),
  validateRequest,
  AdminController.updateProfile
);

router.get(
  '/account',
  authenticate,
  authorize(['admin']),
  AdminController.getProfile
);

router.post(
  '/account/personal-info',
  authenticate,
  authorize(['admin']),
  validateRequest,
  AdminController.addOrUpdateInfo
);

router.get(
  '/doctors/document-verification',
  authenticate,
  authorize(['admin']),
  AdminController.getDoctorsForDocumentVerification
);
router.get(
  '/doctors/:id/details',
  authenticate,
  authorize(['admin']),
  AdminController.getDoctorDetails
);
router.patch(
  '/doctors/:id/verify',
  authenticate,
  authorize(['admin']),
  AdminController.verifyDoctorDocuments
);

//Blogs
router.post(
  '/blogs',
  authenticate,
  authorize(['admin']),
  upload.single('image'),
  AdminController.createBlog
);

router.put(
  '/blogs/:id',
  authenticate,
  authorize(['admin']),
  upload.single('image'),
  AdminController.updateBlog
);

router.get(
  '/blogs',
  authenticate,
  authorize(['admin', 'patient', 'doctor']),
  AdminController.getBlogsList
);

router.get(
  '/blogs/:id',
  authenticate,
  authorize(['admin', 'patient', 'doctor']),
  AdminController.getSingleBlog
);

router.delete(
  '/blogs/:id',
  authenticate,
  authorize(['admin']),
  AdminController.deleteBlog
);
router.get(
  '/blogs/search',
  authenticate,
  authorize(['admin', 'doctor', 'patient']),
  AdminController.searchBlogs
);

// Plans routes
router.use('/plans', plansRoutes);

export default router;
