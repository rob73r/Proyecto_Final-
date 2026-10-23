import mongoose from 'mongoose';

// Conecta con MongoDB Atlas usando la dirección guardada en el .env
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Si falta la variable en el .env, avisamos con un error claro
    if (!uri) {
      throw new Error('No se definió MONGO_URI en el archivo .env');
    }

    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    // Sin base de datos la API no puede funcionar, así que cerramos el programa
    process.exit(1);
  }
};

export default connectDB;