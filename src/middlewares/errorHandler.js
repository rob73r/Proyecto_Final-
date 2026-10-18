// Middleware propio de manejo de errores centralizado.
// Debe registrarse al final, después de las rutas.
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

export default errorHandler;
