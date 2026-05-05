const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importación de modelos y rutas
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const houseRoutes = require('./routes/house.routes');

const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD (OWASP) ---

// 1. Configurar el limitador de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP
  message: { message: 'Demasiadas peticiones desde esta IP, intente de nuevo en 15 minutos.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(helmet());

app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- MIDDLEWARE DE DEBUGGING ---

app.use((req, res, next) => {
    const now = new Date().toLocaleTimeString();
    console.log(`\n[${now}] 🛰️  Petición: ${req.method} ${req.url}`);
    
    if (req.headers.authorization) {
        const partialToken = req.headers.authorization.substring(0, 20);
        console.log(`🔑 Token en Header: ${partialToken}...`);
    }
    
    if (!process.env.JWT_SECRET) {
        console.error("❌ ERROR CRÍTICO: JWT_SECRET no está definido.");
    }
    next();
});

// --- DEFINICIÓN DE RUTAS ---

// Aplicar el limitador específicamente a las rutas de autenticación
app.use('/auth', limiter, authRoutes); 

app.use('/users', userRoutes);
app.use('/houses', houseRoutes);

// Manejo de 404
app.use((req, res) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});

// --- MANEJO GLOBAL DE ERRORES ---

app.use((err, req, res, next) => {
    console.error(`[Error Centralizado]: ${err.stack}`);
    res.status(err.status || 500).json({ 
        message: 'Ocurrió un error interno en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- INICIALIZACIÓN ---
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida con éxito.');
        await sequelize.sync({ force: false });
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Sellnode corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico al iniciar el servidor:', error.message);
        process.exit(1); 
    }
};

startServer();