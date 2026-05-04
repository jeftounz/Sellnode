const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('House', {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        address: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        status: { 
            type: DataTypes.ENUM('disponible', 'vendido'), 
            defaultValue: 'disponible' 
        },
        // Corregido: Debe ser UUID para relacionarse con User.id[cite: 1, 3]
        sellerId: { 
            type: DataTypes.UUID, 
            allowNull: false 
        }
    });
};