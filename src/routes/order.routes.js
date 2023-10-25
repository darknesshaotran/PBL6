const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const orderControllers = require('../controllers/order.controllers');
const router = Router();

router.post('/createOneItem', accessTokenValidator, wrapController(orderControllers.createOneItemOrder));
router.post('/create', accessTokenValidator, wrapController(orderControllers.createOrderWithCartItem));
router.get('/:id_order', accessTokenValidator, wrapController(orderControllers.OrderDetails));

module.exports = router;
