import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for audio file uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const audioFileFilter = (req, file, cb) => {
  // Accept only audio files
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Multer error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: false,
        message: 'File size too large. Maximum size is 50MB.',
      });
    }
    return res.status(400).json({
      status: false,
      message: `Upload error: ${error.message}`,
    });
  }

  if (error.message === 'Only audio files are allowed') {
    return res.status(400).json({
      status: false,
      message: 'Only audio files are allowed',
    });
  }

  next(error);
};

export { audioUpload, uploadsDir, handleMulterError };
