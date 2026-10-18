import * as productService from '../services/productService.js';

// 1) POST /api/products -> crea un producto
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 2) GET /api/products -> lista productos, con filtro opcional ?category=
export const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await productService.findProducts(filter);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// 3) GET /api/products/:id -> obtiene un producto por id
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.findProductById(req.params.id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 4) PUT /api/products/:id -> actualiza un producto
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProductById(req.params.id, req.body);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// 5) GET /api/products/:id/country -> consulta la API externa REST Countries
export const getProductCountry = async (req, res, next) => {
  try {
    const product = await productService.findProductById(req.params.id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const country = await productService.getCountryInfo(product.countryCode);

    res.json({
      success: true,
      product: { id: product._id, name: product.name, countryCode: product.countryCode },
      country,
    });
  } catch (error) {
    next(error);
  }
};
