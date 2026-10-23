# FrescoAlerta

API para llevar el control de la comida que hay en casa y no dejar que las cosas se pudran o se congele la heladera por gusto.

Es una API REST hecha para un proyecto de backend usando **Node.js**, **Express** y **MongoDB Atlas**.

---

## ¿Para qué sirve?

* **Guardar tu comida:** Registra, edita o borra lo que tienes guardado (nombre, cantidad, tipo de alimento y la fecha de vencimiento).
* **Ver qué tienes a la mano:** Te trae la lista completa junto con un conteo rápido: cuántas cosas hay en total, cuántas ya vencieron y cuáles están a punto de vencerse en los próximos 7 días.
* **Filtrar sin enredos:** Puedes buscar directamente por categoría (como `?categoria=lacteos`) o filtrar lo que se vence pronto (`?porVencer=7`).
* **Ideas de cocina:** Si no sabes qué hacer con un ingrediente, la API consulta una base de datos externa y te tira sugerencias de recetas.

---

## ¿Cómo calcula los días de vencimiento?

Para no complicar las cosas ni guardar datos obsoletos en la base de datos, **no guardamos los días restantes**. 

Los días que le quedan a cada alimento y su estado (`fresco`, `por vencer` o `vencido`) se calculan al momento de hacer la consulta. Si el número de días sale negativo, ya sabes que eso venció.

---

## La API de recetas (TheMealDB)

Para las recetas usamos la API pública de **TheMealDB**. Como esa plataforma funciona en inglés, cruzamos el ingrediente con su nombre en inglés (por ejemplo, *pollo* pasa como *chicken*). Por eso las recetas que devuelve la API vienen en inglés.

---

## Atajos y validaciones

* **`express-validator`:** Se encarga de revisar que no mandes campos vacíos, que las fechas tengan formato de verdad (`AAAA-MM-DD`) y que los IDs sean válidos.
* **`requestLogger`:** Un middleware propio para ver en la consola qué ruta se consultó, qué estado devolvió y cuánto tardó.
* **`errorHandler`:** Captura cualquier error feo en el código para devolver una respuesta limpia.

---

## Rutas principales

| Método | Ruta | Qué hace |
| :--- | :--- | :--- |
| `POST` | `/api/alimentos` | Guarda un nuevo alimento. |
| `GET` | `/api/alimentos` | Trae todo lo guardado con el resumen. Acepta filtros como `?categoria=lacteos`. |
| `PUT` | `/api/alimentos/:id` | Edita la info de un alimento. |
| `DELETE` | `/api/alimentos/:id` | Borra un alimento de la lista. |
| `GET` | `/api/alimentos/:id/recetas` | Te busca recetas según el alimento. |

### Ejemplo de cómo enviar un alimento (`POST /api/alimentos`):

```json
{
  "nombre": "Leche entera",
  "cantidad": 2,
  "categoria": "lacteos",
  "fechaVencimiento": "2026-11-20"
}

.
├── app.js                  # Lo que arranca todo
├── pruebas.http            # Archivo con pruebas rápidas para VS Code
└── src/
    ├── seed.js             # Datos de prueba para llenar la BD
    ├── server/             # Configuración de Express
    ├── config/             # Conexión con Mongo Atlas
    ├── routers/            # Las rutas de la API
    ├── controllers/        # Controladores (los que reciben y responden)
    ├── services/           # La lógica pesada del sistema
    ├── models/             # El modelo de datos (Mongoose)
    ├── middlewares/        # Módulos para logs y errores
    └── validators/         # Las reglas de validación
