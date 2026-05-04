const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true,
            validate: { isEmail: true } 
        },
        password: { type: DataTypes.STRING, allowNull: false },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
        hooks: {
            // OWASP: Hashing antes de guardar en la DB
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