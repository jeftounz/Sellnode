const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, 
        define: {
            timestamps: true, // OWASP: Auditoría de registros[cite: 2]
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar Modelos
db.User = require('./User')(sequelize);
db.House = require('./House')(sequelize);

// Configurar Relaciones (OWASP: Integridad referencial para control de acceso)[cite: 2]
db.User.hasMany(db.House, { foreignKey: 'sellerId', as: 'sales' });
db.House.belongsTo(db.User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = db;