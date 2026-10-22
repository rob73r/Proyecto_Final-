import Alimento from '../models/Alimento.js';

// Fecha de hoy a las 00:00 UTC, usada como referencia para los vencimientos.
const inicioDeHoy = () => {
  const ahora = new Date();
  return new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()));
};

// Fecha que resulta de sumar N días a hoy.
const enDias = (dias) => {
  const fecha = inicioDeHoy();
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha;
};

// Registra un nuevo alimento.
export const createAlimento = (data) => {
  return Alimento.create(data);
};

// Lista los alimentos ordenados por vencimiento, con filtros opcionales
// por categoría y días por vencer, junto con un resumen general.
export const findAlimentos = async ({ categoria, porVencer } = {}) => {
  const filter = {};

  if (categoria) {
    filter.categoria = categoria.toLowerCase();
  }

  if (porVencer) {
    filter.fechaVencimiento = {
      $gte: inicioDeHoy(),
      $lte: enDias(Number(porVencer)),
    };
  }

  const hoy = inicioDeHoy();

  const [alimentos, total, vencidos, porVencer7Dias] = await Promise.all([
    Alimento.find(filter).sort({ fechaVencimiento: 1 }),
    Alimento.countDocuments(),
    Alimento.countDocuments({ fechaVencimiento: { $lt: hoy } }),
    Alimento.countDocuments({
      fechaVencimiento: { $gte: hoy, $lte: enDias(7) },
    }),
  ]);

  return { alimentos, resumen: { total, vencidos, porVencer7Dias } };
};

// Busca un alimento por su id.
export const findAlimentoById = (id) => {
  return Alimento.findById(id);
};

// Actualiza un alimento existente.
export const updateAlimentoById = (id, data) => {
  return Alimento.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Elimina un alimento.
export const deleteAlimentoById = (id) => {
  return Alimento.findByIdAndDelete(id);
};

// Equivalencia entre alimentos y los ingredientes (en inglés) de TheMealDB.
const INGREDIENTES = {
  'dulce de leche': 'condensed_milk',
  leche: 'milk',
  huevo: 'eggs',
  queso: 'cheese',
  manteca: 'butter',
  yogur: 'yogurt',
  jamon: 'ham',
  pollo: 'chicken',
  carne: 'beef',
  lechuga: 'lettuce',
};

// Pasa a minúsculas y quita tildes para comparar nombres.
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Consulta la API externa TheMealDB y devuelve recetas para aprovechar el alimento.
export const getRecetas = async (nombreAlimento) => {
  const nombre = normalizar(nombreAlimento);

  // Se prueban primero las claves más largas ("dulce de leche" antes que "leche").
  const clave = Object.keys(INGREDIENTES)
    .sort((a, b) => b.length - a.length)
    .find((k) => nombre.includes(k));

  if (!clave) {
    const error = new Error(`No hay un ingrediente equivalente para "${nombreAlimento}"`);
    error.statusCode = 404;
    throw error;
  }

  const ingrediente = INGREDIENTES[clave];
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('La API externa no respondió correctamente');
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  // TheMealDB devuelve meals en null cuando no hay recetas.
  if (!Array.isArray(data.meals) || data.meals.length === 0) {
    const error = new Error(`No se encontraron recetas con "${ingrediente}"`);
    error.statusCode = 404;
    throw error;
  }

  return {
    ingrediente,
    totalRecetas: data.meals.length,
    recetas: data.meals.slice(0, 5).map((m) => ({
      nombre: m.strMeal,
      imagen: m.strMealThumb,
      pais: m.strCountry,
    })),
  };
};