import mongoose from 'mongoose';

// Esquema de Alimento: define qué datos guardamos de cada alimento.
// De las fechas solo guardamos la de vencimiento.
const alimentoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0,
    },
    // lowercase guarda la categoría en minúscula para que el filtro no falle por una mayúscula
    categoria: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    fechaVencimiento: {
      type: Date,
      required: true,
    },
  },
  {
    // timestamps agrega solos los campos createdAt y updatedAt
    timestamps: true,
    id: false,
    // Para que los campos virtuales aparezcan en las respuestas JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Campo virtual: se calcula cada vez que consultamos y no se guarda en la base.
// Son los días que faltan para vencer (si da negativo, ya venció).
alimentoSchema.virtual('diasRestantes').get(function () {
  const ahora = new Date();
  const hoy = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((this.fechaVencimiento.getTime() - hoy) / msPorDia);
});

// Campo virtual: dice si está vencido, por vencer (7 días o menos) o fresco.
alimentoSchema.virtual('estado').get(function () {
  const dias = this.diasRestantes;
  if (dias < 0) return 'vencido';
  if (dias <= 7) return 'por vencer';
  return 'fresco';
});

export default mongoose.model('Alimento', alimentoSchema);