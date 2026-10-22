import * as alimentoService from '../services/alimentoService.js';

// Error 404 reutilizable cuando un alimento no existe.
const alimentoNoEncontrado = () => {
  const error = new Error('Alimento no encontrado');
  error.statusCode = 404;
  return error;
};

// POST /api/alimentos: registra un alimento.
export const createAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentoService.createAlimento(req.body);
    res.status(201).json({ success: true, data: alimento });
  } catch (error) {
    next(error);
  }
};

// GET /api/alimentos: lista los alimentos con su resumen.
// Filtros opcionales: ?categoria= y ?porVencer=
export const getAlimentos = async (req, res, next) => {
  try {
    const { categoria, porVencer } = req.query;
    const { alimentos, resumen } = await alimentoService.findAlimentos({
      categoria,
      porVencer,
    });
    res.json({ success: true, count: alimentos.length, resumen, data: alimentos });
  } catch (error) {
    next(error);
  }
};

// PUT /api/alimentos/:id: actualiza un alimento.
export const updateAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentoService.updateAlimentoById(req.params.id, req.body);
    if (!alimento) throw alimentoNoEncontrado();
    res.json({ success: true, data: alimento });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/alimentos/:id: elimina un alimento.
export const deleteAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentoService.deleteAlimentoById(req.params.id);
    if (!alimento) throw alimentoNoEncontrado();
    res.json({ success: true, message: 'Alimento eliminado', data: alimento });
  } catch (error) {
    next(error);
  }
};

// GET /api/alimentos/:id/recetas: consulta la API externa TheMealDB
// y sugiere recetas para aprovechar el alimento.
export const getAlimentoRecetas = async (req, res, next) => {
  try {
    const alimento = await alimentoService.findAlimentoById(req.params.id);
    if (!alimento) throw alimentoNoEncontrado();

    const sugerencias = await alimentoService.getRecetas(alimento.nombre);

    res.json({
      success: true,
      alimento: {
        id: alimento._id,
        nombre: alimento.nombre,
        diasRestantes: alimento.diasRestantes,
        estado: alimento.estado,
      },
      sugerencias,
    });
  } catch (error) {
    next(error);
  }
};