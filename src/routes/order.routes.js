const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator, isAdminValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const orderControllers = require('../controllers/order.controllers');
const {
    OrderExistsValidator,
    StatusExistsValidator,
    ItemOrderValidator,
    CartItemOrderValidator,
} = require('../middlewares/order.middlewares');
const router = Router();

router.post(
    '/createOneItem',
    accessTokenValidator,
    ItemOrderValidator,
    wrapController(orderControllers.createOneItemOrder),
);
router.post(
    '/create',
    accessTokenValidator,
    CartItemOrderValidator,
    wrapController(orderControllers.createOrderWithCartItem),
);
router.get('/history', accessTokenValidator, wrapController(orderControllers.HistoryOrder));
router.get('/:id_order', accessTokenValidator, OrderExistsValidator, wrapController(orderControllers.OrderDetails));
router.put(
    '/cancel/:id_order',
    accessTokenValidator,
    OrderExistsValidator,
    wrapController(orderControllers.CancelOrder),
);
router.get(
    '/status/:id_status',
    accessTokenValidator,
    StatusExistsValidator,
    wrapController(orderControllers.StatusOrder),
);

// ADMIN ROUTE /////////////////////////////////////
router.get(
    '/All/status/:id_status',
    accessTokenValidator,
    isAdminValidator,
    StatusExistsValidator,
    wrapController(orderControllers.getAllStatusOrderList),
);
router.put(
    '/updateStatus/:id_order',
    accessTokenValidator,
    isAdminValidator,
    OrderExistsValidator,
    wrapController(orderControllers.UpdateStatusOrder),
);

module.exports = router;
