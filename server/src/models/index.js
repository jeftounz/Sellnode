const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models'); // Importa la configuración de db.js/index_2.js

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Necesario para procesar el body de los forms[cite: 1]

// Rutas (Ejemplo)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/houses', require('./routes/houses'));

const PORT = process.env.PORT || 5000;

// Sincronización de la Base de Datos y arranque del servidor
// .sync() crea las tablas si no existen basándose en tus modelos
db.sequelize.sync({ force: false }) // 'force: false' evita borrar datos existentes al reiniciar
  .then(() => {
    console.log('✅ Base de datos sincronizada con Sequelize');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Sellnode corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });