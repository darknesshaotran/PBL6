const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const router = Router();

router.post('/add', accessTokenValidator, wrapController(cartControllers.addToCart));
router.get('/details', accessTokenValidator, wrapController(cartControllers.getCartDetails));

module.exports = router;
