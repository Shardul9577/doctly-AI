import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
// JWT CREDENTIAL
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;
// DATABASE CONNECTION VARIABLES
export const MONGO_URI = process.env.MONGO_URI;
// EMAIL FOR NODE-MAILER VARIABLES
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
// FRONTEND URL
export const FRONTEND_URL = process.env.FRONTEND_URL;
// OTP CREDENTIAL
export const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
export const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
export const MSG91_OTP_URL =
  process.env.MSG91_OTP_URL || 'https://control.msg91.com/api/v5/otp';
// CLOUDINARY CREDENTIAL
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// ADMIN CREDENTIAL
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// RAZORPAY CREDENTIAL
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
// OPEN ROUTER / OPENAI-COMPATIBLE API
export const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_KEY;
export const OPEN_ROUTER_BASE_URL = process.env.OPEN_ROUTER_BASE_URL;
export const OPEN_ROUTER_APP_TITLE =
  process.env.OPEN_ROUTER_APP_TITLE || 'Doctly AI Services';
export const OPEN_API_KEY = process.env.OPEN_API_KEY;

// WEBSOCKET CONFIGURATION
export const MAX_MESSAGE_LENGTH = process.env.MAX_MESSAGE_LENGTH || 1000;
export const TYPING_INDICATOR_DELAY =
  process.env.TYPING_INDICATOR_DELAY || 1000;
export const MAX_CONVERSATION_HISTORY =
  process.env.MAX_CONVERSATION_HISTORY || 50;
