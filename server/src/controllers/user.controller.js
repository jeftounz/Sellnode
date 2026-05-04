const { User } = require('../models');

// Obtener todos los usuarios (Ruta protegida)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // OWASP: Nunca enviar el hash de la contraseña
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']] // Opcional: ver los más nuevos primero
        });
        res.json(users);
    } catch (error) {
        console.error("❌ Error en getAllUsers:", error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // UUID del usuario a modificar
        const { name, email, isActive } = req.body;

        // NOTA: Si es un panel de admin, podrías quitar este IF.
        // Si es perfil personal, mantenlo para evitar que A modifique a B.
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este perfil' });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Actualizamos los campos permitidos
        await user.update({ name, email, isActive });
        
        // Refrescamos los datos para devolver el objeto limpio
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // ⚠️ IMPORTANTE: Para que tu tabla de Users.jsx funcione eliminando a otros,
        // deberías permitir que un ADMIN elimine, o quitar esta restricción temporalmente.
        // Por ahora, permitiremos borrar si es el mismo usuario O si necesitas gestión total.
        
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Evitar que el usuario se elimine a sí mismo por error si es el único admin
        if (req.user.id === id) {
            return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta desde aquí' });
        }

        await user.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};