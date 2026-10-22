import express from 'express';

import {
  createAlimento,
  getAlimentos,
  updateAlimento,
  deleteAlimento,
  getAlimentoRecetas,
} from '../controllers/alimentoController.js';

import {
  alimentoRules,
  alimentoUpdateRules,
  listQueryRules,
  idRule,
  validate,
} from '../validators/alimentoValidator.js';

const router = express.Router();

// Rutas que consultan la base de datos propia
router.post('/', alimentoRules, validate, createAlimento);
router.get('/', listQueryRules, validate, getAlimentos);
router.put('/:id', idRule, alimentoUpdateRules, validate, updateAlimento);
router.delete('/:id', idRule, validate, deleteAlimento);

// Ruta que consulta la API externa (TheMealDB)
router.get('/:id/recetas', idRule, validate, getAlimentoRecetas);

export default router;