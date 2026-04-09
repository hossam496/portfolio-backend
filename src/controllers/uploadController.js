import stream from 'stream';
import { cloudinary } from '../config/cloudinary.js';

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder || 'portfolio', resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadProjectImage(req, res, next) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(503).json({
        message: 'Image upload is not configured (Cloudinary env vars)',
      });
    }
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await uploadBuffer(req.file.buffer, 'portfolio/projects');
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    next(e);
  }
}
