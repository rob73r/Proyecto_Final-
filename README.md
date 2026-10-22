# FrescoAlerta

API REST para reducir el desperdicio de alimentos en casa mediante el control de inventario y fechas de vencimiento. Proyecto integrador de backend con Node.js, Express y MongoDB Atlas.

## Funcionalidades

- Registrar alimentos con nombre, cantidad, categoría y fecha de vencimiento.
- Listar los alimentos ordenados por fecha de vencimiento, con un resumen (total, vencidos y por vencer en 7 días).
- Filtrar por categoría y por días para vencer.
- Editar y eliminar alimentos.
- Sugerir recetas para aprovechar un alimento (API externa).

## Tecnologías

Node.js (ES Modules), Express, MongoDB Atlas con Mongoose, express-validator, dotenv y nodemon.

## Instalación

1. Instalar dependencias:
```
   npm install
```
2. Copiar `.env.example` como `.env` y completar `MONGO_URI` con la conexión a MongoDB Atlas.
3. Cargar alimentos de ejemplo (opcional):
```
   node src/seed.js
```
4. Iniciar el servidor:
```
   npm run dev
```

El servidor queda disponible en `http://localhost:3000`. El archivo `pruebas.http` contiene peticiones de ejemplo para la extensión REST Client de VS Code.

## Rutas

| # | Método | Ruta | Descripción | Origen |
|---|---|---|---|---|
| 1 | POST | `/api/alimentos` | Registra un alimento | Base de datos |
| 2 | GET | `/api/alimentos` | Lista los alimentos con resumen. Filtros: `?categoria=lacteos` y `?porVencer=7` | Base de datos |
| 3 | PUT | `/api/alimentos/:id` | Edita un alimento | Base de datos |
| 4 | DELETE | `/api/alimentos/:id` | Elimina un alimento | Base de datos |
| 5 | GET | `/api/alimentos/:id/recetas` | Sugiere recetas para aprovechar el alimento | API externa |

Ejemplo de registro:

```json
{
  "nombre": "Leche entera",
  "cantidad": 2,
  "categoria": "lacteos",
  "fechaVencimiento": "2026-11-20"
}
```

### Días restantes

Solo se guarda la fecha de vencimiento. Los campos `diasRestantes` y `estado` (`vencido`, `por vencer` o `fresco`) se calculan en cada consulta, por lo que se actualizan solos todos los días. Un valor negativo indica que el alimento ya venció.

## API externa

La ruta 5 consulta [TheMealDB](https://www.themealdb.com), una API pública de recetas. Cada alimento se relaciona con un ingrediente en inglés (por ejemplo, pollo con `chicken`), por lo que las recetas se devuelven en inglés.

## Validaciones y middlewares

- `express-validator` valida campos obligatorios, formato de fecha (`AAAA-MM-DD`), filtros numéricos e id de MongoDB.
- `requestLogger`: middleware propio que registra método, ruta, código de estado y tiempo de respuesta.
- `errorHandler`: middleware propio que centraliza las respuestas de error.

## Estructura

```
.
├── app.js                  # Punto de entrada
├── pruebas.http            # Peticiones de prueba
└── src/
    ├── seed.js             # Alimentos de ejemplo
    ├── server/server.js    # Configuración de Express
    ├── config/db.js        # Conexión a MongoDB Atlas
    ├── routers/            # Rutas
    ├── controllers/        # Petición y respuesta
    ├── services/           # Lógica y acceso a datos
    ├── models/             # Esquema de Mongoose
    ├── middlewares/        # Middlewares propios
    └── validators/         # Validaciones
```

## Posibles mejoras

- Usuarios, para que cada persona tenga su propio inventario.
- Avisos cuando un alimento esté por vencer.
- Interfaz web o móvil.
- Recetas traducidas al español.