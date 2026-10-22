import { body, param, query, validationResult } from 'express-validator';

// Validación para registrar un alimento (POST).
export const alimentoRules = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isString()
    .withMessage('El nombre debe ser texto'),
  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isFloat({ min: 0 })
    .withMessage('La cantidad debe ser un número mayor o igual a 0'),
  body('categoria')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isString()
    .withMessage('La categoría debe ser texto'),
  body('fechaVencimiento')
    .notEmpty()
    .withMessage('La fecha de vencimiento es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe tener formato AAAA-MM-DD (ej: 2026-11-20)'),

];

// Validación para editar un alimento (PUT): todos los campos son opcionales.
export const alimentoUpdateRules = [
  body('nombre')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isString()
    .withMessage('El nombre debe ser texto'),
  body('cantidad')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La cantidad debe ser un número mayor o igual a 0'),
  body('categoria')
    .optional()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía')
    .isString()
    .withMessage('La categoría debe ser texto'),
  body('fechaVencimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener formato AAAA-MM-DD (ej: 2026-11-20)'),
  
];

// Validación de los filtros del listado: ?categoria= y ?porVencer=
export const listQueryRules = [
  query('categoria')
    .optional()
    .isString()
    .withMessage('La categoría debe ser texto'),
  query('porVencer')
    .optional()
    .isInt({ min: 1 })
    .withMessage('porVencer debe ser un número entero de días (ej: 7)'),
];

// Validación del id de MongoDB en los parámetros de la ruta.
export const idRule = [
  param('id').isMongoId().withMessage('El id proporcionado no es válido'),
];

// Devuelve los errores de validación con código 400.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};