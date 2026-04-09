import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  createMessage,
  listMessages,
  deleteMessage,
  markMessageRead,
} from '../controllers/messageController.js';
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

const createBody = [
  body('name').trim().notEmpty().isLength({ max: 120 }),
  body('email').trim().notEmpty().isEmail(),
  body('message').trim().notEmpty().isLength({ min: 10, max: 5000 }),
];

router.post('/', createBody, runValidation, createMessage);

router.get(
  '/',
  protect,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('limit must be 1–50'),
    query('unreadOnly').optional().isIn(['true', 'false']),
  ],
  runValidation,
  listMessages
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId()],
  runValidation,
  deleteMessage
);

router.patch(
  '/:id/read',
  protect,
  [
    param('id').isMongoId(),
    body('read').optional().isBoolean(),
  ],
  runValidation,
  markMessageRead
);

export default router;
