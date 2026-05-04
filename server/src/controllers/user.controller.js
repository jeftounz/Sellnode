const { User } = require('../models');

// Obtener todos los usuarios (Ruta protegida)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // OWASP: Nunca enviar el hash de la contraseña ni datos sensibles innecesarios
            attributes: { exclude: ['password'] } 
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isActive } = req.body;

        // OWASP A01:2021: Control de Acceso basado en el propietario
        // Evita que el usuario A modifique al usuario B
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este perfil' });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.update({ name, email, isActive });
        
        // Devolvemos el objeto actualizado sin el password
        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // OWASP A01:2021: Control de Acceso
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este usuario' });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};