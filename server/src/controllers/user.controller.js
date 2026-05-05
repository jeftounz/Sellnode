const { User } = require('../models');

// 1. OBTENER TODOS LOS USUARIOS[cite: 2]
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'isActive', 'createdAt'] // Seguridad: sin password[cite: 2]
        });
        res.json(users);
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// 2. ACTUALIZAR USUARIO[cite: 2]
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isActive } = req.body;

        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validación de duplicados si el email cambia[cite: 2]
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Este correo ya está registrado por otro usuario' });
            }
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            isActive: isActive !== undefined ? isActive : user.isActive
        });

        res.json({ 
            message: 'Usuario actualizado con éxito', 
            user: { id: user.id, name: user.name, email: user.email, isActive: user.isActive } 
        });

    } catch (error) {
        console.error("Error detallado en updateUser:", error);
        res.status(500).json({ message: 'Error en el servidor al actualizar' });
    }
};

// 3. ELIMINAR USUARIO[cite: 2]
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Protección: no eliminarse a sí mismo[cite: 2]
        if (id === req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta de administrador' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: 'Error al intentar eliminar' });
    }
};