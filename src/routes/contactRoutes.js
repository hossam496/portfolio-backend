import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createMessage } from '../controllers/messageController.js';

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
  '/',
  [
    body('name').trim().notEmpty().isLength({ max: 120 }),
    body('email').trim().notEmpty().isEmail(),
    body('message').trim().notEmpty().isLength({ min: 10, max: 5000 }),
  ],
  runValidation,
  createMessage
);

export default router;
