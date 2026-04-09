import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
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

const linkOrEmpty = (field) =>
  body(field)
    .optional()
    .trim()
    .custom((v) => v === '' || /^https?:\/\/.+/i.test(v))
    .withMessage(`${field} must be a valid URL or empty`);

const projectBody = [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('description').trim().notEmpty().isLength({ max: 5000 }),
  body('image').trim().notEmpty().isURL(),
  body('technologies').optional().isArray({ max: 50 }),
  body('technologies.*').optional().isString().trim().isLength({ max: 80 }),
  linkOrEmpty('githubLink'),
  linkOrEmpty('liveDemo'),
];

const projectBodyOptional = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('image').optional().trim().notEmpty().isURL(),
  body('technologies').optional().isArray({ max: 50 }),
  body('technologies.*').optional().isString().trim().isLength({ max: 80 }),
  linkOrEmpty('githubLink'),
  linkOrEmpty('liveDemo'),
];

router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('limit must be between 1 and 100'),
    query('tech').optional().isString().trim().isLength({ max: 80 }),
  ],
  runValidation,
  getProjects
);

router.post('/', protect, projectBody, runValidation, createProject);

router.put(
  '/:id',
  protect,
  [param('id').isMongoId(), ...projectBodyOptional],
  runValidation,
  updateProject
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId()],
  runValidation,
  deleteProject
);

export default router;
