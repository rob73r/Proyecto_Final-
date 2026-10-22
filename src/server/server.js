import express from 'express';

import connectDB from '../config/db.js';
import requestLogger from '../middlewares/requestLogger.js';
import errorHandler from '../middlewares/errorHandler.js';
import alimentoRouter from '../routers/alimentoRouter.js';

const app = express();

// Conexión a MongoDB Atlas
connectDB();

// Middlewares globales
app.use(express.json());
app.use(requestLogger);

// Ruta de verificación del servidor
app.get('/', (req, res) => {
  res.json({ message: 'API FrescoAlerta funcionando' });
});

// Rutas de la API
app.use('/api/alimentos', alimentoRouter);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;