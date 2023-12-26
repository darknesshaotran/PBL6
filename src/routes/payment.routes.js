const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator } = require('../middlewares/user.middlewares');
const checkout_session = require('../utils/stripe');
const { paymentInforValidator, itemsValidator } = require('../middlewares/payment.middlewares');

// const { loginValidator } = require('../middlewares/user.middlewares.js');

const router = Router();

// const UserController = require('../controllers/user.controllers');
router.post('/', accessTokenValidator, paymentInforValidator, itemsValidator, wrapController(checkout_session));

module.exports = router;
