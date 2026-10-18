import express from 'express';

import connectDB from '../config/db.js';
import requestLogger from '../middlewares/requestLogger.js';
import errorHandler from '../middlewares/errorHandler.js';
import productRouter from '../routers/productRouter.js';

const app = express();

// Conexión a MongoDB Atlas
connectDB();

// Middlewares globales
app.use(express.json());
app.use(requestLogger); // middleware propio

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de catálogo de productos funcionando 🚀' });
});

// Rutas del proyecto
app.use('/api/products', productRouter);

// Middleware de errores (siempre al final)
app.use(errorHandler);

export default app;
