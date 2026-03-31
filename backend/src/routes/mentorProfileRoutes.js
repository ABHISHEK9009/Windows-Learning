import express from 'express';
const router = express.Router();
import multer from 'multer';
import {
  getMentorProfile,
  updateMentorProfile,
  getMyMentorProfile,
  createMentorProfile,
  searchMentors,
  uploadFile
} from '../controllers/mentorProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Public routes
router.get('/search', searchMentors);
router.get('/:id', getMentorProfile);

// Protected routes
router.get('/my/profile', protect, getMyMentorProfile);
router.post('/', protect, createMentorProfile);
router.put('/:id', protect, updateMentorProfile);
router.post('/upload', protect, upload.single('file'), uploadFile);

export default router;
