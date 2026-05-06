const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const houseRoutes = require('./routes/house.routes');

const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10kb' })); // Límite de carga para prevenir ataques DoS

// --- RUTAS ---
app.use('/api/auth', limiter, authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/houses', houseRoutes);

// --- INICIALIZACIÓN ---
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false }); // Crea tablas si no existen sin borrar datos
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Sellnode corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico al iniciar el servidor:', error.message);
        process.exit(1); 
    }
};

startServer();