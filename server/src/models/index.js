const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, // Evita llenar la consola de logs de SQL en desarrollo
        define: {
            timestamps: true, // OWASP: Importante para auditoría de creación/actualización
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar Modelos
db.User = require('./User')(sequelize);
db.House = require('./House')(sequelize);

// Configurar Relaciones (OWASP: Control de acceso basado en integridad referencial)
// Un usuario (vendedor) tiene muchas casas
db.User.hasMany(db.House, { foreignKey: 'sellerId', as: 'sales' });
db.House.belongsTo(db.User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = db;