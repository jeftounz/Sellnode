const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('House', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        address: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        status: { 
            type: DataTypes.ENUM('disponible', 'vendido'), 
            defaultValue: 'disponible' 
        },
        sellerId: { type: DataTypes.INTEGER, allowNull: false } // FK gestionada por Sequelize
    });
};