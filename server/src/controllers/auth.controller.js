const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }

        // La contraseña se hashea automáticamente en el hook 'beforeCreate' del modelo User
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'Usuario creado con éxito', userId: newUser.id });

    } catch (error) {
        res.status(500).json({ message: 'Error interno al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const finalEmail = typeof email === 'object' ? email.email : email;

        const user = await User.findOne({ where: { email: finalEmail } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Bienvenido',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};