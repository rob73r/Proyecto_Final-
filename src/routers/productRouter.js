import express from 'express';

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  getProductCountry,
} from '../controllers/productController.js';

import { productRules, idRule, validate } from '../validators/productValidator.js';

const router = express.Router();

// --- Rutas que consultan la base de datos propia (4) ---
router.post('/', productRules, validate, createProduct);
router.get('/', getProducts);
router.get('/:id', idRule, validate, getProductById);
router.put('/:id', idRule, productRules, validate, updateProduct);

// --- Ruta que consulta una API externa (1) ---
router.get('/:id/country', idRule, validate, getProductCountry);

export default router;
