const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializamos la instancia de conexión
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, 
        define: {
            timestamps: true, // Para auditoría (OWASP)
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos los modelos pasando la instancia de sequelize
// Asegúrate de que User.js y House.js estén en esta misma carpeta
db.User = require('./User')(sequelize);
db.House = require('./House')(sequelize);

// Configuramos las relaciones (Integridad referencial)
db.User.hasMany(db.House, { foreignKey: 'sellerId', as: 'sales' });
db.House.belongsTo(db.User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = db;