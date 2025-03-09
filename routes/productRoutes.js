import express from 'express';
import productController from '../controllers/productController.js';
import { validateSearchParams } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/advanced-search', validateSearchParams, productController.advancedSearch);

export default router;
