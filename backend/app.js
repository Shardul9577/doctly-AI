// Core packages
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Local modules
import connectDB from './src/config/connect.db.js';
import errorHandler from './src/middleware/error.middleware.js';
import authRoutes from './src/modules/auth/routes/auth.routes.js';
import doctorProfileRoutes from './src/modules/doctor/profile/routes/profile.routes.js';
import doctorPatientRoutes from './src/modules/doctor/patient/routes/patient.routes.js';
import doctorVisitRoutes from './src/modules/doctor/visit/routes/visit.routes.js';
import patientVisitRoutes from './src/modules/patient/visit/routes/visit.routes.js';
import adminRoutes from './src/modules/admin/routes/admin.routes.js';
import patientProfileRoutes from './src/modules/patient/profile/routes/profile.routes.js';
import patientDoctorRoutes from './src/modules/patient/doctor/routes/doctor.routes.js';
import contactRoutes from './src/modules/contact/routes/contact.routes.js';
import aiRoutes from './src/modules/AI/routes/ai.routes.js';

const app = express();

// Render / other reverse proxies: restore real client IP for rate limiting and logs
app.set('trust proxy', 1);

/* ==========================
   Database Connection
========================== */
connectDB(); // Connect to MongoDB

/* ==========================
   Global Middlewares
========================== */

// CORS: allow any browser origin. `origin: true` reflects the request Origin (required when
// `credentials: true`; using `origin: '*'` would make browsers reject the response).
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Default Helmet sets Cross-Origin-Resource-Policy: same-origin, which blocks the browser
// from reading cross-origin API responses (Network tab shows a generic "CORS error").
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// Do not count CORS preflights toward the limit (OPTIONS would otherwise waste budget)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
  }),
);

// Compress response bodies
app.use(compression());

// Parse incoming JSON request bodies
app.use(express.json({ limit: '50mb' })); // for JSON payloads

/* ==========================
   Routes
========================== */

// Authentication routes
app.use('/api/auth', authRoutes);
// Doctor profile routes
app.use('/api/doctors/profile', doctorProfileRoutes);
// Doctor patient routes
app.use('/api/doctors/patient', doctorPatientRoutes);
// Doctor visit routes
app.use('/api/doctors/visit', doctorVisitRoutes);
app.use('/api/patients/visit', patientVisitRoutes);
// Admin routes
app.use('/api/admin', adminRoutes);
// Patient profile routes
app.use('/api/patients/profile', patientProfileRoutes);
// Patient Doctor routes
app.use('/api/patients/doctor', patientDoctorRoutes);
// Contact routes
app.use('/api', contactRoutes);
// AI routes
app.use('/api/ai', aiRoutes);
/* ==========================
   Error Handling Middleware
========================== */

// Handles errors thrown from controllers or middleware
app.use(errorHandler);

/* ==========================
   Export App
========================== */
export default app;
