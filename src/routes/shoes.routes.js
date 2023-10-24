const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();

const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');

router.get('/add', wrapController(shoesControllers.addShoes));
router.get('/:id_shoes', wrapController(shoesControllers.shoesDetails));
router.get('/', wrapController(shoesControllers.showAllShoes));

module.exports = router;
