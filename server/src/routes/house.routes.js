const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

router.get('/', authenticateToken, (req, res) => res.send('Lista de inmuebles'));

module.exports = router;