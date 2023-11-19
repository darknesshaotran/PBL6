const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const {
    AddToCartValidator,
    UpdateCartItemQuantityValidator,
    DeleteCartItemValidator,
} = require('../middlewares/cart.middlewares');
const router = Router();

router.post('/add', accessTokenValidator, AddToCartValidator, wrapController(cartControllers.addToCart));
router.get('/details', accessTokenValidator, wrapController(cartControllers.getCartDetails));
router.put(
    '/updateQuantity/:id_cartItem',
    accessTokenValidator,
    UpdateCartItemQuantityValidator,
    wrapController(cartControllers.updateQuantityItem),
);
router.delete(
    '/delete/:id_cartItem',
    accessTokenValidator,
    DeleteCartItemValidator,
    wrapController(cartControllers.deleteCartItem),
);

module.exports = router;
