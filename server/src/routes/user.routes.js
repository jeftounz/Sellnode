const router = require('express').Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, userController.getAllUsers);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;