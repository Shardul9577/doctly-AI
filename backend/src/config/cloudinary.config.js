import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from './env.config.js';

// ✅ Configure cloudinary (do NOT assign to a variable)
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// ✅ Now pass the actual cloudinary instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // not cloudinaryConfig
  params: {
    folder: '/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
});

const upload = multer({ storage });
export default upload;
