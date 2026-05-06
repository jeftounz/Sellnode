const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        name: { 
            type: DataTypes.STRING(250), // Límite de 250 caracteres
            allowNull: false,
            validate: { len: [1, 250] }
        },
        email: { 
            type: DataTypes.STRING(250), 
            allowNull: false, 
            unique: true,
            validate: { 
                isEmail: true,
                len: [1, 250]
            } 
        },
        password: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        isActive: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: true 
        }
    }, {
        hooks: {
            // Encriptación robusta antes de guardar[cite: 4]
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(12);
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });
    return User;
};