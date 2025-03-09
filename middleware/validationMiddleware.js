import { query, validationResult } from 'express-validator';

const validateSearchParams = [
  query('category').optional().isString().withMessage('Category must be a string'),
  query('tags').optional().custom(value => {
    if (!value) return true;
    const tags = Array.isArray(value) ? value : [value];
    if (tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
      throw new Error('Each tag must be a non-empty string');
    }
    return true;
  }),
  query('minPrice')
  .optional()
  .isFloat({ min: 0 })
  .withMessage('Min price must be a positive number'),
  query('maxPrice')
  .optional().isFloat({ min: 0 })
  .withMessage('Max price must be a positive number'),
  query('minRating')
  .optional()
  .isFloat({ min: 0, max: 5 })
  .withMessage('Min rating must be between 0 and 5'),
  query('maxRating').optional().isFloat({ min: 0, max: 5 }).withMessage('Max rating must be between 0 and 5'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive number'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative number'),
  query('sortBy').optional().isIn(['price', 'rating', 'createdAt', 'name']).withMessage('Sort by must be price, rating, createdAt, or name'),
  query('sortOrder').optional().isIn(['ASC', 'DESC', 'asc', 'desc']).withMessage('Sort order must be ASC or DESC'),
  (req, res, next) => {
    const { minPrice, maxPrice, minRating, maxRating } = req.query;
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      return res.status(400).json({ status: 'error', message: 'Min price cannot be greater than max price' });
    }
    if (minRating && maxRating && parseFloat(minRating) > parseFloat(maxRating)) {
      return res.status(400).json({ status: 'error', message: 'Min rating cannot be greater than max rating' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    next();
  }
];

export { validateSearchParams };