const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const router = Router();

router.post('/add', accessTokenValidator, wrapController(cartControllers.addToCart));
router.get('/details', accessTokenValidator, wrapController(cartControllers.getCartDetails));
router.put('/updateQuantity/:id_shoes', accessTokenValidator, wrapController(cartControllers.updateQuantityItem));
router.delete('/delete/:id_cartItem', accessTokenValidator, wrapController(cartControllers.deleteCartItem));

module.exports = router;
