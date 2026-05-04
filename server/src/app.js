const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importación de modelos y rutas
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const houseRoutes = require('./routes/house.routes');

const app = express();

// --- MIDDLEWARES DE SEGURIDAD (OWASP) ---

// Configura cabeceras HTTP seguras
app.use(helmet()); 

// Configura CORS de forma restrictiva
app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Limita el tamaño del payload para prevenir ataques DoS (Denial of Service)
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- DEFINICIÓN DE RUTAS ---

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/houses', houseRoutes);

// Manejo de rutas no encontradas (404)
// OWASP: No dejar rutas abiertas que den pistas sobre la estructura del server
app.use((req, res) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});

// --- MANEJO GLOBAL DE ERRORES ---

app.use((err, req, res, next) => {
    // Log interno para el desarrollador
    console.error(`[Error Centralizado]: ${err.stack}`);

    // OWASP: Respuesta genérica al cliente para no exponer detalles del sistema
    res.status(err.status || 500).json({ 
        message: 'Ocurrió un error interno en el servidor',
        // Solo enviar el error en desarrollo, nunca en producción
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- INICIALIZACIÓN DEL SERVIDOR Y DB ---

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Verificar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida con éxito.');

        // 2. Sincronizar modelos (force: false para no borrar datos)
        await sequelize.sync({ force: false });
        console.log('✅ Modelos de base de datos sincronizados.');

        // 3. Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Sellnode corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico al iniciar el servidor:', error.message);
        process.exit(1); // Cerramos el proceso si no hay DB
    }
};

startServer();