const { Router } = require('express');
const { wrapController } = require('../utils/handle');
const { accessTokenValidator, refreshTokenValidator } = require('../middlewares/user.middlewares.js');
const addressControllers = require('../controllers/address.controllers');
const router = Router();
router.get('/', accessTokenValidator, wrapController(addressControllers.getAddressList));
router.post('/add', accessTokenValidator, wrapController(addressControllers.addAddress));
router.delete('/delete/:id_address', wrapController(addressControllers.deleteAddress));
router.put('/update/:id_address', wrapController(addressControllers.updateAddress));

module.exports = router;
