import 'dotenv/config';
import mongoose from 'mongoose';
import Alimento from './models/Alimento.js';

// Fecha resultante de sumar N días a hoy (negativo = ya vencido).
const enDias = (dias) => {
  const ahora = new Date();
  return new Date(
    Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + dias)
  );
};

// Alimentos habituales de una heladera argentina.
const alimentos = [
  { nombre: 'Leche entera', cantidad: 2, categoria: 'lacteos', fechaVencimiento: enDias(5) },
  { nombre: 'Huevos', cantidad: 12, categoria: 'huevos', fechaVencimiento: enDias(22) },
  { nombre: 'Queso cremoso', cantidad: 1, categoria: 'lacteos', fechaVencimiento: enDias(11) },
  { nombre: 'Manteca', cantidad: 2, categoria: 'lacteos', fechaVencimiento: enDias(57) },
  { nombre: 'Yogur', cantidad: 4, categoria: 'lacteos', fechaVencimiento: enDias(-2) },
  { nombre: 'Dulce de leche', cantidad: 1, categoria: 'dulces', fechaVencimiento: enDias(124) },
  { nombre: 'Jamón cocido', cantidad: 1, categoria: 'fiambres', fechaVencimiento: enDias(3) },
  { nombre: 'Pollo', cantidad: 2, categoria: 'carnes', fechaVencimiento: enDias(2) },
  { nombre: 'Carne picada', cantidad: 1, categoria: 'carnes', fechaVencimiento: enDias(-1) },
  { nombre: 'Lechuga', cantidad: 1, categoria: 'verduras', fechaVencimiento: enDias(7) },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Alimento.deleteMany();
    await Alimento.insertMany(alimentos);
    console.log(`${alimentos.length} alimentos cargados`);
  } catch (error) {
    console.error('Error al cargar los alimentos:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();