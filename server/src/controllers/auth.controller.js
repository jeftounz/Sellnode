const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de email inválido' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }

        // newUser.id será un UUID generado por el modelo
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'Usuario creado con éxito', userId: newUser.id });

    } catch (error) {
        console.error("❌ ERROR EN DB AL REGISTRAR:", error); 
        res.status(500).json({ message: 'Error interno al registrar usuario' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;

        // FIX: Si el frontend envía { email: { email: '...' } }, extraemos solo el string
        const finalEmail = typeof email === 'object' ? email.email : email;

        if (!finalEmail || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Buscamos al usuario usando el string extraído
        const user = await User.findOne({ where: { email: finalEmail } });
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // OWASP: Comparación segura de hash[cite: 3]
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generación del Token JWT[cite: 3]
        // IMPORTANTE: Asegúrate de tener JWT_SECRET en tu archivo .env
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_fallback_para_test', 
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Bienvenido',
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            }
        });
    } catch (error) {
        // Log detallado para depuración en Ubuntu
        console.error("❌ ERROR EN LOGIN:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};