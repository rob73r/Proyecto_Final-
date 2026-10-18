import 'dotenv/config';
import app from './src/server/server.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`😊 → Servidor escuchando en el puerto ${PORT}`);
});
