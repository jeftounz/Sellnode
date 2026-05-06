const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('House', {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        address: { 
            type: DataTypes.STRING(250), // Límite de 250 caracteres
            allowNull: false,
            validate: { len: [1, 250] },
            set(value) {
                // Sanitización: Elimina etiquetas para prevenir XSS/Inyecciones
                this.setDataValue('address', value.replace(/[<>]/g, "").trim());
            }
        },
        price: { 
            type: DataTypes.DECIMAL(12, 2), // Permite decimales
            allowNull: false,
            validate: {
                min: 0, // No acepta números negativos
                isDecimal: true
            }
        },
        status: { 
            type: DataTypes.ENUM('disponible', 'vendido'), 
            defaultValue: 'disponible' 
        },
        sellerId: { 
            type: DataTypes.UUID, 
            allowNull: false // Relacionado con User.id
        }
    });
};