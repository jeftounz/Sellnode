const router = require('express').Router();
const houseController = require('../controllers/house.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, houseController.createHouse);
router.get('/', auth, houseController.getAllHouses);
router.put('/:id', auth, houseController.updateHouse);
router.delete('/:id', auth, houseController.deleteHouse);

module.exports = router;