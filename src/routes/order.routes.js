const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const orderControllers = require('../controllers/order.controllers');
const router = Router();

router.post('/createOneItem', accessTokenValidator, wrapController(orderControllers.createOneItemOrder));
router.post('/create', accessTokenValidator, wrapController(orderControllers.createOrderWithCartItem));
router.get('/history', accessTokenValidator, wrapController(orderControllers.HistoryOrder));
router.get('/:id_order', accessTokenValidator, wrapController(orderControllers.OrderDetails));
router.delete('/cancel/:id_order', accessTokenValidator, wrapController(orderControllers.CancelOrder));

module.exports = router;
