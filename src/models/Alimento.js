import mongoose from 'mongoose';

// Esquema de Alimento: solo se almacena la fecha de vencimiento.
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
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Días restantes hasta el vencimiento. Se calcula en cada consulta.
// Un valor negativo indica que el alimento ya venció.
alimentoSchema.virtual('diasRestantes').get(function () {
  const ahora = new Date();
  const hoy = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((this.fechaVencimiento.getTime() - hoy) / msPorDia);
});

// Estado según los días restantes: vencido, por vencer (7 días o menos) o fresco.
alimentoSchema.virtual('estado').get(function () {
  const dias = this.diasRestantes;
  if (dias < 0) return 'vencido';
  if (dias <= 7) return 'por vencer';
  return 'fresco';
});

export default mongoose.model('Alimento', alimentoSchema);