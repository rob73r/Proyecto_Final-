import { body, param, validationResult } from 'express-validator';

// Reglas para crear/actualizar un producto
export const productRules = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isString()
    .withMessage('El nombre debe ser texto'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser texto'),
  body('price')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('category')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isString()
    .withMessage('La categoría debe ser texto'),
  body('countryCode')
    .notEmpty()
    .withMessage('El código de país (countryCode) es obligatorio')
    .isLength({ min: 2, max: 3 })
    .withMessage('El countryCode debe tener 2 o 3 letras (ej: PE, ARG)'),
];

// Regla para validar el :id de Mongo en los parámetros de ruta
export const idRule = [
  param('id').isMongoId().withMessage('El id proporcionado no es válido'),
];

// Middleware que revisa el resultado de las validaciones anteriores
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
