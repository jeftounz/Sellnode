const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// Ejemplo de ruta protegida (OWASP: Control de acceso)
router.get('/', authenticateToken, (req, res) => res.send('Lista de usuarios'));

module.exports = router;