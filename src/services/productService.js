import Product from '../models/Product.js';

// Esta capa concentra la lógica de negocio y el acceso a la base de datos.
// El controlador solo se encarga de hablar con HTTP (req/res);
// el service se encarga de hablar con Mongoose/MongoDB.

export const createProduct = (data) => {
  return Product.create(data);
};

export const findProducts = (filter = {}) => {
  return Product.find(filter).sort({ createdAt: -1 });
};

export const findProductById = (id) => {
  return Product.findById(id);
};

export const updateProductById = (id, data) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Lógica para la ruta que consume la API externa 
export const getCountryInfo = async (countryCode) => {
  const url = `https://date.nager.at/api/v3/CountryInfo/${countryCode}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(
      `No se encontró información para el código de país "${countryCode}"`
    );
    error.statusCode = 404;
    throw error;
  }

  const countryData = await response.json();

  return {
    name: countryData?.commonName,
    officialName: countryData?.officialName,
    nativeName: countryData?.nativeName,
    region: countryData?.region,
    borders: (countryData?.borders || []).map((b) => b.commonName),
  };
};