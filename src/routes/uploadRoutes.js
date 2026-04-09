import { Router } from 'express';
import { uploadProjectImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

function singleImage(req, res, next) {
  uploadImage.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}

router.post('/', protect, singleImage, uploadProjectImage);

export default router;
