# Examen Final Integrador — API de Catálogo de Productos

API REST hecha con Node.js, Express y MongoDB Atlas (Mongoose).

## Cómo correrlo

1. `npm install`
2. Copia `.env.example` a `.env` y coloca tu cadena de conexión de MongoDB Atlas en `MONGO_URI`.
3. `npm run dev` (o `npm start`)
4. El servidor queda en `http://localhost:3000`

## Estructura del proyecto

Usa ES Modules (`import`/`export`), habilitado con `"type": "module"` en `package.json`.

```
.
├── app.js                 # Punto de entrada: carga .env y levanta el servidor
├── src/
│   ├── server/server.js   # Configura Express (middlewares y rutas), conecta la BD
│   ├── config/db.js       # Conexión a MongoDB Atlas
│   ├── controllers/       # Maneja req/res, delega al service
│   ├── routers/           # Define los endpoints
│   ├── services/          # Lógica de negocio + acceso a BD (Mongoose)
│   ├── models/            # Esquema de Mongoose (Product)
│   ├── middlewares/       # Middleware propio (logger y manejo de errores)
│   └── validators/        # Reglas de express-validator
└── .env                   # Variables de entorno (no se sube a git)
```

**Nota técnica:** `app.js` empieza con `import 'dotenv/config';` (no `import dotenv from 'dotenv'; dotenv.config();` después). Esto es a propósito: en ES Modules, todos los `import` de un archivo se resuelven **antes** de que corra el resto del código, en el orden en que aparecen. Si `dotenv.config()` se llamara después de importar `server.js`, `server.js` ya habría intentado leer `process.env.MONGO_URI` sin que existiera todavía.

## Rutas

| # | Método | Ruta                          | Descripción                                              | Origen           |
|---|--------|-------------------------------|-----------------------------------------------------------|-------------------|
| 1 | POST   | /api/products                 | Crea un producto                                          | Base de datos     |
| 2 | GET    | /api/products                 | Lista productos (filtro opcional `?category=`)             | Base de datos     |
| 3 | GET    | /api/products/:id             | Obtiene un producto por id                                 | Base de datos     |
| 4 | PUT    | /api/products/:id             | Actualiza un producto                                      | Base de datos     |
| 5 | GET    | /api/products/:id/country     | Info del país de origen del producto (`countryCode`)        | API externa       |

La ruta 5 consume **REST Countries** (`https://restcountries.com`), que es pública y **no requiere API key**.

## Ejemplo de body para crear un producto

```json
{
  "name": "Café orgánico",
  "description": "Café de altura tostado artesanalmente",
  "price": 25.5,
  "stock": 100,
  "category": "alimentos",
  "countryCode": "PE"
}
```

## Checklist de consignas cubiertas

- [x] Base de datos propia en MongoDB Atlas (Mongoose)
- [x] Servidor Node con rutas y métodos HTTP (GET, POST, PUT)
- [x] Esquema propio y original (`Product`)
- [x] Validación con `express-validator` (`validators/productValidator.js`)
- [x] Middleware propio (`requestLogger.js` y `errorHandler.js`)
- [x] Ruta que consulta una API externa (`GET /api/products/:id/country`)

Recuerda: inscribirte al DEFI con el formulario antes de la entrega (02-03-2026).
