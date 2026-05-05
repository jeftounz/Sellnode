const router = require('express').Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

// Definición de endpoints vinculados al controlador[cite: 2]
router.get('/', auth, userController.getAllUsers);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router; // ✅ Exportación correcta para app.use()[cite: 1]