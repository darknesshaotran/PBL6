const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator, isAdminValidator } = require('../middlewares/user.middlewares.js');
const cartControllers = require('../controllers/cart.controllers');
const orderControllers = require('../controllers/order.controllers');
const { OrderExistsValidator, StatusExistsValidator, ItemOrderValidator } = require('../middlewares/order.middlewares');
const revenueControllers = require('../controllers/revenue.controllers');
const { TimeValidator } = require('../middlewares/revenue.middlewares');
const router = Router();

router.get(
    '/customer',
    accessTokenValidator,
    isAdminValidator,
    TimeValidator,
    wrapController(revenueControllers.getRevenueOfCustommer),
);
router.get('/product', TimeValidator, wrapController(revenueControllers.getRevenueOfProduction));
router.get(
    '/',
    accessTokenValidator,
    isAdminValidator,
    TimeValidator,
    wrapController(revenueControllers.getRevenuesByTime),
);

module.exports = router;
