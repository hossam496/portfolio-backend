import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok =
      /^image\/(jpeg|png|gif|webp|jpg)$/i.test(file.mimetype) ||
      /\.(jpe?g|png|gif|webp)$/i.test(file.originalname);
    if (ok) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});
