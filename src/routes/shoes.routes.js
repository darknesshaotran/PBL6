const { Router } = require('express');
const { wrapController } = require('../utils/handle');

const router = Router();

const userControllers = require('../controllers/user.controllers');
const shoesControllers = require('../controllers/shoes.controllers');
router.get('/', wrapController(shoesControllers.showAllShoes));
router.get('/:id_shoes', wrapController(shoesControllers.shoesDetails));

module.exports = router;
