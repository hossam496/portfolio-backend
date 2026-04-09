import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { login, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

router.post(
  '/login',
  [
    body('email').trim().notEmpty().isEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  runValidation,
  login
);

router.get('/me', protect, me);

export default router;
