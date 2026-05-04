const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas de entrada
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'Usuario creado con éxito', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const user = await User.findOne({ where: { email } });
        
        // OWASP: Mensaje genérico para no confirmar si el email existe o no
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparar password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar JWT
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